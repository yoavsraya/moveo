const mongodb = require('mongodb');
const getDB = require('../util/dataBase').getDB;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(i_userName, i_password, i_instrument, i_isAdmin)
    {
        this.userName = i_userName;
        this.password = i_password;
        this.instrument = i_instrument;
        this.admin = i_isAdmin;
    }

    save() 
    {
    const db = getDB();
    return db.collection('users')
    .insertOne(this)
    .then(result => {
        return db.collection('users').findOne({ _id: result.insertedId });
      });
    }

    static findUserbyID(i_ID)
    {
        const db = getDB();
        return db.collection('users').findOne({_id: new ObjectId(i_ID)})
        .then()
        .catch(error => {
            console.log(error); 
            throw error;           
        });
    };

    static async findUserByName(i_username)
    {
        const db = getDB();
        return db.collection('users').findOne({userName : i_username})
        .then()
        .catch(error => {
            console.log(error); 
            throw error;
        });
    }
        
}

module.exports = User;
