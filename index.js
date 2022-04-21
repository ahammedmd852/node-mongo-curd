const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// user: dbuser1
// password: oqCnjWWPWITCA8v9

const uri = "mongodb+srv://dbuser1:oqCnjWWPWITCA8v9@cluster0.uzzep.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const userCollection = client.db("foodExpress").collection("user");

        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log("Adding new user", newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally {
        // await client.close();
    };
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('My node Curd server is ready');
});

app.listen(port, () => {
    console.log('My CRUD server is running.');
});