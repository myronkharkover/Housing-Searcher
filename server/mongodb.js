// import express
const express = require('express');
const cors = require('cors');

// create our express app
const webapp = express();

// import database functions
const lib = require('./mongodbOperations');
// declare the database object
let db;

// MongoDB URL
const url = "mongodb+srv://admin:cis4500admin@users.15joyub.mongodb.net/?retryWrites=true&w=majority&appName=Users";

//configure the app to handle JSON and to parse request body
webapp.use(express.json());
webapp.use(express.urlencoded({
    extended: true,
}));
webapp.use(cors({
  origin: '*',
}));

// implement the endpoints
//Root endpoint
webapp.get('/', (req, resp) => {
    resp.json({message: 'Hello this is working'});
});

webapp.post('/signup', async (req, resp)=>{
     try{
         const result = await lib.addUser(db, {username: req.body.username, password: req.body.password, first: req.body.first, last: req.body.last, favoriteLocations: []});
         //send the response
         resp.status(201).json({message: `User with id ${JSON.stringify(result.insertedId)} added`, id: result.insertedId});

         

     }catch(err){
      console.log(err)
      resp.status(500).json({error: 'try again later'});
    }
});

webapp.post('/addFavorite', async (req, resp)=>{
  try{
      const result = await lib.addFavorite(db, {userId: req.body.userId, newLocation: req.body.newLocation});
      //send the response
      resp.status(201).json({message: "New location added", id: result.insertedId});

      

  }catch(err){
   console.log(err)
   resp.status(500).json({error: 'try again later'});
 }
});

webapp.post('/login', async (req, resp) => {
  const username = req.body.username
  const password = req.body.password
  console.log(username + password)
  try {
    const results = await lib.login(db, {username: username, password: password})
    if (!results) {
      console.log(results)
      return resp.status(401).json({ message: 'Invalid username or password' , success: false});
    } else {
      console.log(results)
      resp.json({ message: 'Login successful', success: true, id: results._id });
    }
  } catch (err) {
    console.log(err)
    resp.status(500).json({error: 'try again later'});
  }
})

// Get users endpoint
webapp.get('/users',  async (_req, resp) => {
    try{
        const results = await lib.getUsers(db);
        resp.status(200).json({data: results});
    }
    catch(err){
        resp.status(500).json({error: 'try again later'});
    }
});

webapp.get('/userbyusername/:username',  async (_req, resp) => {
  try{
      const username = _req.params.username;
      const results = await lib.getUser(db, username);
      if (user) {
        resp.json(results);
      } else {
        resp.status(404).json({ message: 'User not found' });
      }
  }
  catch(err){
      resp.status(500).json({error: 'try again later'});
  }
});

webapp.get('/user/:id',  async (_req, resp) => {
  try{
      const userId = _req.params.id;
      console.log(userId);
      const user = await lib.getUserByID(db, userId);
      console.log(user)
      if (user) {
        resp.json(user);
      } else {
        resp.status(404).json({ message: 'User not found' });
      }
  }
  catch(err){
      console.log(err)
      resp.status(500).json({error: 'try again later'});
  }
});

// declare the port
const port = 8000;

//start the app and connect to the DB
webapp.listen(port, async () =>{
    db = await lib.connect(url);
    console.log(`Express server running on port:${port}`);
});