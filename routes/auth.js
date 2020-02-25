const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken')
const {registerValidation,loginValidation} = require('../validation')
//REGISTER USER
router.post("/register",async(req,res)=>{
    //Let's validate the data before we make a user
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);
    //checkk if the email is already exists:
    const emailExist = await User.findOne({email:req.body.email})
    if(emailExist) return res.status(400).send('Email Already exists')

    //Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const newUser = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    });
    try {
        await newUser.save();
        res.send({
            user:newUser._id
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

//LOGIN USER
router.post('/login',async (req,res)=>{
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //checkk if the email is already exists:
    const user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send('Email not found');

    //check whether password is correct or not 
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send("Invalid password")

    //Create and assign a token
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);

    res.status(200).send('logged in')
})
module.exports=router