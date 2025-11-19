const dotenv = require('dotenv').config();
const express = require('express');
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/authRouter');
const propertyRouter = require('./routes/propertyRouter');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const notFound = require('./utils/notFound');
dbConnect();
 
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});


const app = express();

app.use(express.json());
app.use(fileUpload({useTempFiles: true}));


app.use('/api/v1/', authRouter);
app.use('/api/v1/properties', propertyRouter);

app.use(notFound);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}..... and db connected`);
});
