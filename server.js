const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 5000;

// we are not create all route here in here for this one will use routes
// app.get('/api/contacts', (req,res) => {   
//     //res.send("get all Contacts"); Regular response
//     // res.json({message:"get all Contacts"}); // json response
//     res.status(200).json({message:"get all Contacts"}); // json response
// });

app.use(express.json()); // this is middleware parser from server and client when passing data as json

app.use('/api/contacts', require("./routes/contactRoutes"));
app.use('/api/user', require("./routes/userRoutes")); // this is we are adding for authentication


app.use(errorHandler ); // errorhandler middle ware

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});