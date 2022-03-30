const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const VerificationToken = require('../models/verificationTokenModel');
const { generateOtp } = require('../utils/mail');

exports.createUser = async (req, res) => {
	const {name, email, password} = req.body;

	const user = await User.findOne({email});
	if(user){
		return res.status(400).json({success: false, error: 'User with this email already exists!'});
	}

	const newUser = new User({
		name,
		email,
		password
	});

	const OTP = generateOtp();
	const verificationToken = new VerificationToken({
		owner: newUser._id,
		token: OTP
	});

	await verificationToken.save();
	await newUser.save();
	res.send(newUser);
};

exports.signin = async (req, res) => {
	const {email, password} = req.body;

	if(!email.trim() || !password.trim())
		return res.status(400).json({success: false, error: 'Email or Password is missing!'});

	const user = await User.findOne({email});

	if(!user) return res.status(400).json({success: false, error: 'User not found!'});

	const isMatched = await user.comparePassword(password);
	if(!isMatched) return res.status(400).json({success: false, error: 'Email/Password does not match!'});

	const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET, {
		expiresIn:'1d'
	})

	res.json({success: true, 
		user: {name: user.name, email: user.email, id: user._id, token }
	})
}
