const express = require("express");
const router = express.Router();
const { 
    getContacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

// Move this logic to controller.js
// router.route('/').get((req,res) => {   
//     res.status(200).json({message:"get all Contacts"}); // json response
// });

router.use(validateToken); // if all routes are protected route
// if some route then use like this 
// router.route('/').get(getContacts); router.get('/:id',validateToken, getContact);

router.route('/').get(getContacts).post(createContact);

// router.route('/').post(createContact); 

router.route('/:id').get(getContact).put(updateContact).delete(deleteContact);


module.exports = router;