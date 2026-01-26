// requiring modules
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8888; // Use env PORT for Render (defaults to 8888 locally)
const admin = require("firebase-admin");

// Load env vars (for local dev; Render uses built-in env vars)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Parse Firebase service account from env var
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (err) {
  console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', err);
  process.exit(1); // Exit if invalid (prevents running without creds)
}

// middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// firestore commands
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const auth = admin.auth(); // If you're using auth, otherwise remove

// get and post commands
app.get("/", (req, res) => {
  res.render("landing.ejs");
});

app.get("/earlyAccess", (req, res) => {
  res.render("earlyAccess.ejs");
});

app.post("/earlyAccess", async (req, res) => { // Made async for better error handling
  try {
    const { name, email } = req.body;
    
    await db.collection("earlyAccess").add({
      name: name,
      email: email,
      date: new Date()
    });
    
    res.redirect("/");
  } catch (err) {
    console.error('Error adding to Firestore:', err);
    res.redirect("/earlyAccess");
  }
});

// listening to the port
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});