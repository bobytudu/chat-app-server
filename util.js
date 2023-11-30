const fs = require("fs");
var admin = require("firebase-admin");
// const algoliasearch = require('algoliasearch');
var serviceAccount = require("./service_key.json");

//FIREBASE
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const firestore = admin.firestore();

// file write
function writeToFile(path, data) {
  fs.writeFile(path, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log(`file created at ${path}`);
  });
}

async function getUser(email) {
  try {
    const usersRef = firestore.collection("users");
    const querySnapshot = await usersRef.where("email", "==", email).get();
    const result = querySnapshot.docs.map((doc) => doc.data());
    return result[0];
  } catch (error) {
    console.log(error.message);
  }
}

// async function createBackup(table, folderLocation) {
//     const detailRef = firestore.collection(table)
//     const folder = folderLocation || "backup"
//     checkDir(folder)
//     try {
//         let json = []
//         const snapshot = await detailRef.get()
//         snapshot.forEach(doc => {
//             json.push({
//                 uid: doc.id,
//                 ...doc.data()
//             })
//         });
//         writeToFile(`./${folder}/${table}.json`, json)
//     } catch (error) {
//         console.log(error.message)
//     }
// }
function checkDir(folderName) {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  writeToFile,
  firestore,
  getUser,
  //   createBackup,
  admin,
};
