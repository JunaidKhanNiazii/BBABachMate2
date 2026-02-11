const BaseModel = require('./BaseModel');

class FYP extends BaseModel {
    static get collectionName() { return 'fyps'; }
}

class Project extends BaseModel {
    static get collectionName() { return 'projects'; }
}

class Course extends BaseModel {
    static get collectionName() { return 'courses'; }
}

class Training extends BaseModel {
    static get collectionName() { return 'trainings'; }
}

class Collaboration extends BaseModel {
    static get collectionName() { return 'collaborations'; }
}

class Product extends BaseModel {
    static get collectionName() { return 'products'; }
}

class OpenHouse extends BaseModel {
    static get collectionName() { return 'openhouses'; }
}

module.exports = {
    FYP,
    Project,
    Course,
    Training,
    Collaboration,
    Product,
    OpenHouse
};
