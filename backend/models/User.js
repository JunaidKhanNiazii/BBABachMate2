const BaseModel = require('./BaseModel');
const { firestore } = require('../config/firebase');

class User extends BaseModel {
    static get collectionName() { return 'users'; }

    constructor(data) {
        super(data);
        // Ensure _id exists for compatibility (BaseModel does this too, but we want to be sure about firebaseUid mapping)
        if (this.firebaseUid && !this._id) {
            this._id = this.firebaseUid;
        }
    }

    // --- Specialized Static Methods ---

    static async findOne(query) {
        // BaseModel doesn't have a generic findOne that handles specific logic efficiently yet,
        // or we want to override for specific optimizations.

        // Supports { firebaseUid: '...' }
        if (query.firebaseUid) {
            return this.findById(query.firebaseUid);
        }

        // Supports { email: '...' }
        if (query.email) {
            try {
                const snapshot = await this.collection.where('email', '==', query.email).limit(1).get();
                if (snapshot.empty) return null;
                const doc = snapshot.docs[0];
                return new User({ ...doc.data(), _id: doc.id });
            } catch (error) {
                console.error('User.findOne error:', error);
                throw error;
            }
        }

        return null;
    }

    // Override save to ensure firebaseUid is set as ID
    async save() {
        if (!this.firebaseUid) throw new Error('firebaseUid is required for User');
        this._id = this.firebaseUid; // Force ID to be firebaseUid
        return super.save();
    }
}

module.exports = User;
