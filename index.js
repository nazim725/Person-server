const express = require('express')
const app = express();
const port = process.env.PORT || 5000
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId

const cors = require('cors')
require('dotenv').config();

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9s2cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();


        const database = client.db("Cruds-task");
        const personCollection = database.collection("persons");

        // save profile to database
        app.post('/persons', async (req, res) => {
            const persons = req.body;
            const result = await personCollection.insertOne(persons)
            res.json(result)

        });

        // get a single person from person collection
        app.get('/persons/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const person = await personCollection.findOne(query);
            res.json(person);
        });



        // update data into persons collection
        app.put('/persons/:id', async (req, res) => {
            const id = req.params.id;
            console.log('updating', id)
            const updatedPerson = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedPerson.name,
                    phone: updatedPerson.phone,
                    email: updatedPerson.email,
                    hobbies: updatedPerson.hobbies


                },
            };
            const result = await personCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)


        });

        // delete a data from profile collection
        app.delete('/persons/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await personCollection.deleteOne(query);
            res.json(result);
        })

        // get all person
        app.get('/persons', async (req, res) => {

            const cursor = personCollection.find({});
            const person = await cursor.toArray();
            res.send(person);


        });



    }
    finally {
        // await client.close(()
    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.json('Cruds Operation person server')
})

app.listen(port, () => {
    console.log(`Person server  at :${port}`)
})