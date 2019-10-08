var mongoose = require('mongoose');

// Database Name
const dbName = 'garam_masala';
const url = `mongodb://localhost:27017/${dbName}`;

async function dbConnection() {
  try {
    await mongoose.connect( url, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    let db = mongoose.connection;

    // Connection Error
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  }
  catch(err) {
    console.log('qwds', err);
  }
}

// Use connect method to connect to the server
module.exports = {
  connection: dbConnection
}