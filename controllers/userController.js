const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { use } = require("../routes/contactRoutes");

//@desc Register a User
//@route POST /api/users/register
//@access public 

const registerUser = asyncHandler(async (req,res) => {
    const {username,email,password} = req.body;
    if(!username || !email || !password ) {
        res.status(400);
        throw new Error("All fields are mendatory !");
    }
    const userAvailable = await User.findOne({ email }); // this will check in db about email address
    if(userAvailable) {
        res.status(400);
        throw new Error("User Already Registred!");
    }
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hash Password:", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    if(user){
        res.status(201).json({_id: user.id, email: user.email});
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.status(201).json(user); // json response
    // res.json({message: "Register the user"});
});

//@desc Login a User
//@route POST /api/users/login
//@access public 

const loginUser = asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    // check for validation
    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are mandetory!");
    }
    // check for user is available or not
    const user = await User.findOne({email});
    // once we get use we need to compare password from client and database
    // compare password with hashed Password
    if(user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username : user.username,
                email: user.email,
                id: user.id,
            }
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"}
        );
        res.status(200).json({accessToken});
        
    } else {
        res.status(401)
        throw new Error("Email or Password is not valid");
    }
    res.json({message: "Logged In the user"});
});

//@desc User Information
//@route GET /api/users/current
//@access private 

const currentUser = asyncHandler(async (req,res) => {
    res.json(req.user);
});

module.exports = { 
    registerUser, 
    loginUser,
    currentUser,
};