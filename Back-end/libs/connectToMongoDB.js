const mongoose = require('mongoose');

function connectToMongoDB() {
   
  const responce = mongoose.connect('mongodb://localhost:27019/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connect to MongoDB")
  return responce;

}

module.exports = connectToMongoDB;
