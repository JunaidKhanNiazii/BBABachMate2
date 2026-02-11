const { firestore, admin } = require('../config/firebase');

// Global Cache for User Profiles to boost speed across all queries
const userCache = new Map();
const USER_CACHE_TTL = 10000; // 10 seconds

class BaseModel {
    constructor(data) {
        if (data) Object.assign(this, data);
        if (this.id && !this._id) this._id = this.id;
    }

    // Must be overridden by subclasses
    static get collectionName() {
        throw new Error('collectionName must be defined');
    }

    static get collection() {
        if (!firestore) throw new Error('Firestore not initialized');
        return firestore.collection(this.collectionName);
    }

    // --- Static Methods ---

    static async findById(id) {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists) return null;
            return new this({ ...doc.data(), _id: doc.id });
        } catch (error) {
            console.error(`${this.name}.findById error:`, error);
            throw error;
        }
    }

    static async findByIdAndDelete(id) {
        try {
            await this.collection.doc(id).delete();
            return true;
        } catch (error) {
            console.error(`${this.name}.findByIdAndDelete error:`, error);
            throw error;
        }
    }

    static find(query) {
        let queryRef = this.collection;

        // Basic filtering
        if (query) {
            // Loop through query keys. Be careful with internal keys.
            Object.keys(query).forEach(key => {
                const value = query[key];

                // Handle ID specifically
                if (key === '_id' || key === 'id') {
                    if (value) {
                        queryRef = queryRef.where(admin.firestore.FieldPath.documentId(), '==', value);
                    }
                    return;
                }

                if (typeof value === 'object' && value !== null) {
                    // Handle special mongo-like operators if possible
                    if (value.$regex) {
                        // Firestore does not support regex.
                        // We will have to filter in memory (expensive but functional for small datasets)
                        // Mark for memory filter
                    } else {
                        // Assume direct match for now or equality
                        queryRef = queryRef.where(key, '==', value);
                    }
                } else {
                    queryRef = queryRef.where(key, '==', value);
                }
            });
        }

        const ModelClass = this;

        const queryBuilder = {
            _ref: queryRef,
            _populations: [],
            _sort: null,
            _memoryFilter: query, // Pass original query for memory filtering (regex)

            where: function (field, op, val) {
                this._ref = this._ref.where(field, op, val);
                return this;
            },

            populate: function (field, select) {
                this._populations.push({ field, select });
                return this;
            },

            select: function (fields) {
                return this;
            },

            sort: function (sortOptions) {
                this._sort = sortOptions;
                // We will NOT apply orderBy here to avoid composite index requirements.
                // Instead, we will sort in memory in the 'then' method.
                return this;
            },

            then: async function (resolve, reject) {
                try {
                    const snapshot = await this._ref.get();
                    let items = snapshot.docs.map(doc => new ModelClass({ ...doc.data(), _id: doc.id }));

                    // Memory Filtering for Regex (e.g. search)
                    if (this._memoryFilter) {
                        Object.keys(this._memoryFilter).forEach(key => {
                            const val = this._memoryFilter[key];
                            // Skip _id in memory filter as it is handled by query
                            if (key === '_id' || key === 'id') return;

                            if (val && val.$regex) {
                                const regex = new RegExp(val.$regex, val.$options);
                                items = items.filter(item => regex.test(item[key]));
                            }
                        });
                    }

                    // Optimized Population
                    if (this._populations.length > 0 && items.length > 0) {
                        for (const pop of this._populations) {
                            if (pop.field === 'createdBy') {
                                // 1. Collect unique IDs to fetch
                                const userIds = [...new Set(items
                                    .map(item => item.createdBy)
                                    .filter(id => !!id)
                                    .map(id => typeof id === 'string' ? id : id.toString())
                                )];

                                if (userIds.length > 0) {
                                    const userMap = new Map();
                                    const now = Date.now();
                                    const missingIds = [];

                                    // 1. Check Cache first
                                    userIds.forEach(id => {
                                        const cached = userCache.get(id);
                                        if (cached && (now - cached.timestamp < USER_CACHE_TTL)) {
                                            userMap.set(id, cached.data);
                                        } else {
                                            missingIds.push(id);
                                        }
                                    });

                                    // 2. Fetch missing from Firestore in chunks of 30
                                    if (missingIds.length > 0) {
                                        for (let i = 0; i < missingIds.length; i += 30) {
                                            const chunk = missingIds.slice(i, i + 30);
                                            const usersSnapshot = await firestore.collection('users')
                                                .where(admin.firestore.FieldPath.documentId(), 'in', chunk)
                                                .get();

                                            usersSnapshot.forEach(doc => {
                                                const userData = { ...doc.data(), _id: doc.id };
                                                userMap.set(doc.id, userData);
                                                // Update Global Cache
                                                userCache.set(doc.id, { data: userData, timestamp: now });
                                            });
                                        }
                                    }

                                    // 3. Assign back to items
                                    items.forEach(item => {
                                        if (item.createdBy) {
                                            const id = typeof item.createdBy === 'string' ? item.createdBy : item.createdBy.toString();
                                            item.createdBy = userMap.get(id) || null;
                                        }
                                    });
                                }
                            }
                        }
                    }

                    // In-Memory Sorting
                    if (this._sort && items.length > 0) {
                        const field = Object.keys(this._sort)[0];
                        const direction = this._sort[field] === -1 ? -1 : 1;

                        items.sort((a, b) => {
                            let valA = a[field];
                            let valB = b[field];

                            // Handle dates
                            if (field === 'createdAt' || field === 'updatedAt' || field === 'deadline') {
                                valA = new Date(valA || 0);
                                valB = new Date(valB || 0);
                            }

                            if (valA < valB) return -1 * direction;
                            if (valA > valB) return 1 * direction;
                            return 0;
                        });
                    }

                    resolve(items);
                } catch (err) {
                    // Fallback for missing index errors?
                    console.error('Firestore Query Error:', err.message);
                    reject(err);
                }
            },

            catch: function (reject) {
                return this.then(val => val, reject);
            }
        };
        return queryBuilder;
    }

    static async countDocuments(query) {
        let queryRef = this.collection;
        if (query) {
            Object.keys(query).forEach(key => {
                const value = query[key];

                if (key === '_id' || key === 'id') {
                    if (value) {
                        queryRef = queryRef.where(admin.firestore.FieldPath.documentId(), '==', value);
                    }
                    return;
                }

                if (typeof value !== 'object') {
                    queryRef = queryRef.where(key, '==', value);
                }
            });
        }
        const snapshot = await queryRef.count().get();
        return snapshot.data().count;
    }

    // --- Instance Methods ---

    async populate(field, select) {
        // Populate self
        if (field === 'createdBy' && this.createdBy) {
            const userId = this.createdBy.toString();
            const userDoc = await firestore.collection('users').doc(userId).get();
            if (userDoc.exists) {
                this.createdBy = { ...userDoc.data(), _id: userDoc.id };
            }
        }
        return this; // Chainable
    }

    async save() {
        const data = { ...this };

        // Remove internal/private fields
        delete data._id;
        delete data._collectionName;

        if (!data.createdAt) data.createdAt = new Date().toISOString();
        data.updatedAt = new Date().toISOString();

        // Ensure we have an ID?
        // If no ID, create new doc
        let docRef;
        if (this._id) {
            docRef = this.constructor.collection.doc(this._id);
        } else {
            docRef = this.constructor.collection.doc(); // Auto ID
            this._id = docRef.id;
        }

        // We need to store 'createdBy' as just the ID string if it was populated
        if (data.createdBy && typeof data.createdBy === 'object' && data.createdBy._id) {
            data.createdBy = data.createdBy._id;
        }

        await docRef.set(data, { merge: true });
        return this;
    }

    async deleteOne() {
        if (!this._id) throw new Error('Cannot delete item without _id');
        await this.constructor.collection.doc(this._id).delete();
        return true;
    }
}

module.exports = BaseModel;
