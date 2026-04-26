require('dotenv').config();
const express = require("express");
const admin = require("firebase-admin"); // Use the admin SDK
const app = express();
const PORT = process.env.PORT || 8888;

// 1. Properly initialize Firebase
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); // Now db has the collection() methods

// middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/moments", (req, res) => {
    res.render("moments");
});

app.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // 2. Add await here so it finishes before rendering
        await db.collection("contact").add({
            name,
            email,
            message,
            timestamp: admin.firestore.FieldValue.serverTimestamp() // Good for sorting later
        });

        res.render("success");
    } catch (err) {
        console.log(`An error has occurred: ${err}`);
        res.render("fail");
    }
});

// listening to the port
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});