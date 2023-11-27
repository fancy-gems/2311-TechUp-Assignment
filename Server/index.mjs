import express from "express";
import { MongoClient, ServerApiVersion }from "mongodb";
import dotenv from "dotenv";
import 'dotenv/config';
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
//app.set("view engine", "ejs"); 
//Uses EJS as view engine, if you are using EJS. If you don't use EJS, you should remove this.

const port = 3000;
dotenv.config();
app.use(express.urlencoded({extended:true}));
app.use(express.static("public")); 
//This serves static files like HTML, CSS, JS from a directory named "public" to the client-side of a web app, so static files can be accessed by users' web browsers 

// console.log('MongoDB URI:', process.env.MONGODB_URI);

// 3. Connect to the specific URI you copied over just now
const uri = process.env.MONGODB_URI; 
//Allows the web app to access the environment variable aka the secret URL with your MongoDB username and password via `process.env.MONGODB_URI`. URI basically means URL.

// 4. Create a new MongoClient i.e. way to facilitate data transmission 
const client = new MongoClient(uri, { //Creates a constant variable named `client` to connect to MongoDB server, taking the `uri` parameter for the MongoDB server 
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

// 5. Connect to the MongoDB server and let you know if you have successfully connected to the server
async function connect() {
    try {
      console.log("Attempting to connect to MongoDB");
      await client.connect();
      console.log("Connected to MongoDB")
      return client.db("ElecDB"); //Change this to the name of your db that you keyed in on MongoDB
    } catch (err) {
      console.error("Error:", err);
    } 
  }
// connect()
// 6. Additional middleware to make the connection available to other parts of the Express.js application through `req` and attach the database object to the request
app.use(async (req, res, next) => {
    req.db = await connect();
    next();
  });

  // 7. This is where you shine! Perform your database operations here, e.g. the app.get function. This is what you should do to display a list of documents (aka data) from a MongoDB collection: 
app.get("/", async (req, res) => {
    try {
      const collection = req.db.collection("your_collection_name"); //Replace "your_collection_name" with the actual name of the MongoDB collection from which you want to retrieve documents.
      const documents = await collection.find({}).toArray();    
      res.render("your_template_name", { documents }); //Replace "your_template_name" with the name of the template you want to render (if you are using a template engine). Alternatively, you can send the data as JSON if your application doesn't use template rendering.
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred while fetching data.");
    }
  });


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });

app.post("/submit",(req,res)=>{
    console.log(req.body)
});//need to check if this /submit is correct. We prob haven't defined the page? -> this depends on the public html i think. 
// also, replace the consolde log with the response we want to give. See 3.4 solution4.js

app.listen(port, ()=> {
    console.log(`Server running on port ${port}.`);
});



// app.get("/", (req,res) => {
//     res.send("<h1>Mr Anderson, welcome back. We missed you.</h1>");
// });

// app.get("/about", (req,res) => {
//     res.send("<h1>Call me Smith.</h1>");
// });
