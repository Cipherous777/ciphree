
// requiring modules

const admin = require("firebase-admin")
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const serviceAccount = require("./firebase-key.json")
const { credential } = require("firebase-admin");

// funcitonality 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore()
const auth = admin.auth()




module.exports = {db, auth, admin}