// 1. Import MongoDB driver
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId; 

//2. Connect to the DB and return the connection object
const connect = async (url) =>{
    try{
       const conn = (await MongoClient.connect(url,
        {useNewUrlParser: true, useUnifiedTopology: true})).db();
        console.log(`Connected to the database: ${conn.databaseName}`);
        return conn;
    } catch(err){
        console.error(err);
        throw new Error('could not connect to the db');
    }
}

//3. add a player to the DB
const addUser = async (db, newUser) => {
    try{
        const result = await db.collection('users').insertOne(newUser);
        console.log(`Created player with id: ${result.insertedId}`);
        return result;

    } catch(err){
        console.error(err);
        throw new Error('could not add a player');
    }

}

const addFavorite = async (db, data) => {
    try{
       // const currentLocations = await db.collection('users').find({_id: new ObjectId(`${data.userId}`)})
        const result = await db.collection('users').findOneAndUpdate({ _id: new ObjectId(`${data.userId}`) },
            { $addToSet: { favoriteLocations: data.newLocation } },
            { new: true })
            if (result) {
                console.log(`Saved location ${data.newLocation} added for user ${data.userId}`);
                return result;
            } else {
                console.log(`Error adding location`);
                return null;
            }
        

    } catch(err){
        console.error(err);
        throw new Error('could not add location');
    }

}

async function login(db, data) {
    try {
        console.log(data)
        const user = await db.collection('users').find({ username: data.username, password: data.password }).toArray();
        console.log("RETURNING: ")
        console.log(user[0])
        return user[0];
    } catch (error) {
        console.error('Error logging in:', error);
        throw new Error("could not login")
    }
    
}

//3. get all players
async function getUsers(db){
    try{
        // retrieve all the players in the collection and convert the cursor
        // to an array
        const results = await db.collection('users').find({}).toArray();
        return results;
    }catch(err){
        console.error(err);
        throw new Error('could not retrieve players');
    }

}

async function getUser(db, user){
    try{
        // retrieve all the players in the collection and convert the cursor
        // to an array
        console.log("user.username" + user.username)
        const results = await db.collection('users').find({username: user.username}).toArray();
        return results;
    } catch(err){
        console.error(err);
        throw new Error('could not retrieve players');
    }

}

async function getUserByID(db, userId){
    try{
        const results = await db.collection('users').find({_id: new ObjectId(`${userId}`)}).toArray()
        return results;
    }catch(err){
        console.error(err);
        throw new Error('could not retrieve user');
    }
}

module.exports = { connect, addUser, getUsers, getUser, getUserByID, addFavorite, login };