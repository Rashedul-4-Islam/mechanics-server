const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uxoa3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
      try{
        await client.connect();
        const database = client.db("carMechanic");
        const serviceCollection = database.collection('services');
        // get api 
        app.get('/services',async(req,res) =>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        // GET singel ID 
        app.get('/services/:id',async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })
        
        // post api 
        app.post('/services',async(req,res) =>{
             const service = req.body; 
            console.log('hit the post api',service);

            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })
        // Delete API 
        app.delete('/services/:id',async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result)
        })


      }
      finally{

      }
}
run().catch(console.dir)

app.get('/',(req,res) =>{
    res.send('Running genius server')
})

app.listen(port,()=>{
    console.log('Running genius server on port',port)
})