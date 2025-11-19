const mongoose = require('mongoose');

const dbConnect = async () => {
   try {
     const connect = await mongoose.connect(process.env.dbURL);
    console.log(
        `db connected: ${connect.connection.host}, ${connect.connection.name}`
    );
   } catch (error) {
    console.log(error)
   }
};


module.exports = dbConnect;