const BaseModel = require('./BaseModel');

class Inquiry extends BaseModel {
    static get collectionName() { return 'inquiries'; }
}

module.exports = Inquiry;
