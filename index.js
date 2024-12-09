const express =require('express')
const app = express();
const cors =require('cors')
require('dotenv').config()
const port =process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ot66xwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const TourCollectionDB = client.db("TourmanagementDb").collection("AddSpots")

        app.post('/AddSpots',async(req,res)=>{
                const data =req.body;
                const result =await TourCollectionDB.insertOne(data)
                res.send(result)
            })

        app.get('/AddSpots',async(req,res)=>{
            const result  =await TourCollectionDB.find().toArray();
            res.send(result);
        })

        app.get('')

        app.get('/Addspots/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const spotDetails = await TourCollectionDB.findOne({ _id: new ObjectId(id) });
                if (spotDetails) {
                    res.send(spotDetails);
                } else {
                    res.status(404).send({ message: "Spot not found" });
                }
            } catch (error) {
                res.status(500).send({ message: "Error fetching details", error });
            }
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("Hellow Tour Manager")
})

app.listen(port,()=>{
    console.log(`Tour Manager sitting on port  ${port}`);
})