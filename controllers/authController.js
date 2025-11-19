const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const handleError = require('../utils/handleError');



const signUp = async (req, res) => {
  try {
  const  {firstname, lastname, password, email, role} = req.body;
  const salt = await bcrypt.genSalt();
  hashedPassword = await bcrypt.hash(password, salt);


  const newUser = new User({ firstname, lastname, password: hashedPassword, email, role });
  await newUser.save();
  res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });


  } catch (error) {
     const errors = handleError(error)
    res.status(400).json(errors);
  }
};

const signIn = async (req, res) => {
    try {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({success: false, msg: "please provide necessary information"});
    }

    const user = await User.findOne({ email });
    if(!user) {
        
        throw new Error("user not found");
      
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error("Incorrect password");
    }

    const token = jwt.sign({id:user._id, role: user.role},
         process.env.jwt_secret,
        {expiresIn: '7d'}
    );

    res.status(200).json({ success: true, message: "login successful", token , user: {firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role}});
    
    } catch (error) {
     const errors = handleError(error)
    res.status(400).json(errors);
    
    }
};


module.exports = { signUp, signIn };