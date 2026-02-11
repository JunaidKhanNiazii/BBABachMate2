const BaseModel = require('./BaseModel');

class Job extends BaseModel {
    static get collectionName() { return 'jobs'; }
}

class Internship extends BaseModel {
    static get collectionName() { return 'internships'; }
}

class Speaker extends BaseModel {
    static get collectionName() { return 'speakers'; }
}

class Research extends BaseModel {
    static get collectionName() { return 'research'; }
}

class Challenge extends BaseModel {
    static get collectionName() { return 'challenges'; }
}

module.exports = {
    Job,
    Internship,
    Speaker,
    Research,
    Challenge
};
