const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
// to avoid try cache block we have use this asyncHandler in express

//@desc Get all contacts
//@route GET /api/contacts
//@access private 

const getContacts = asyncHandler(async (req,res) => {  
    const contacts = await Contact.find({user_id: req.user.id}); 
    res.status(200).json(contacts); 
});

//@desc Create contact
//@route POST /api/contacts
//@access private 

const createContact = asyncHandler(async (req,res) => {   
    console.log(req.body);
    const {name,email,phone} = req.body;
    if(!name || !email || !phone ) {
        res.status(400);
        throw new Error("All fields are mendatory !");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });
    res.status(201).json(contact); // json response
    //res.status(201).json({message:"Contact Created."}); // json response
});

//@desc Get Contact for ID
//@route GET /api/contacts/:id
//@access private 

const getContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id); 
    if(!contact) {
        res.status(404);
        throw new Error("Contact Not Found");
    }
    res.status(200).json(contact); // json response
    // res.status(200).json({message: `Get Contact for ${req.params.id}`}); // json response
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private 

const updateContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id); 
    if(!contact) {
        res.status(404);
        throw new Error("Contact Not Found");
    }
    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User do not have permision to update other user contact");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.status(200).json(updatedContact); // json response
});

//@desc delete contact
//@route DELETE /api/contacts/:id
//@access private 

const deleteContact = asyncHandler(async (req,res) => {  
    const contact = await Contact.findById(req.params.id); 
    if(!contact) {
        res.status(404);
        throw new Error("Contact Not Found");
    }
    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User do not have permision to delete other user contact");
    }
    await Contact.deleteOne({ _id:req.params.id });
    res.status(200).json(contact); // json response
});

module.exports = { 
    getContacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact
};