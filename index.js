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

        app.get('/AddSpots', async (req, res) => {
            const userEmail = req.query.email;
            if (!userEmail) {
                return res.status(400).send({ message: 'Email is required' });
            }
            try {
                const result = await TourCollectionDB.find({ email: userEmail }).toArray(); // Ensure only the matching email's data is returned
                if (result.length === 0) {
                    return res.status(404).send({ message: 'No spots found for this email' });
                }
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: 'Error fetching data' });
            }
        });
        
        app.put('/AddSpots/:id', async (req, res) => {
            const { id } = req.params;
            console.log(id);
            const updatedData = req.body;

            try {
                const result = await TourCollectionDB.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );

                if (result.modifiedCount > 0) {
                    res.status(200).send({ success: true });
                } else {
                    res.status(404).send({
                        success: false,
                        message: 'Spot not found or no changes detected.',
                    });
                }
            } catch (error) {
                console.error('Error:', error); 
                res.status(500).send({
                    success: false,
                    error: 'An error occurred while updating the spot.',
                });
            }
        });












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