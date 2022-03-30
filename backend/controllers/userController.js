const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const VerificationToken = require('../models/verificationTokenModel');
const { generateOtp, mailTransport, generateEmailTemplate, plainEmailTemplate } = require('../utils/mail');
const { isValidObjectId } = require('mongoose');

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

	mailTransport().sendMail({
		from: 'emailverifcation@email.com',
		to: newUser.email,
		subject: "MERN-Auth - Verify your Email account",
		html: generateEmailTemplate(OTP)
	})

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

exports.verifyEmail = async (req, res) => {
	const {userId, otp} = req.body

	if(!userId || !otp.trim()) 
		return res.status(400).json({success: false, error: 'Invalid request, missing parameters!'});

	if(!isValidObjectId(userId)) return res.status(400).json({success: false, error: 'Invalid user id!'});

	const user = await User.findById(userId);
	if(!user) return res.status(400).json({success: false, error: 'User not found!'});

	if(user.verified) return res.status(400).json({success: false, error: 'User is already verified!'});

	const token = await VerificationToken.findOne({owner: user._id});
	if(!token) return res.status(400).json({success: false, error: 'User not found!'});

	const isMatched = await token.compareToken(otp);
	if(!isMatched) return res.status(400).json({success: false, error: 'Please provide a valid token!'});

	user.verified = true;

	await VerificationToken.findByIdAndDelete(token._id);
	await user.save();

	mailTransport().sendMail({
		from: 'emailverifcation@email.com',
		to: user.email,
		subject: "MERN-Auth - Email verified successfully",
		html: plainEmailTemplate()
	});

	res.json({success: true, 
		message: "Your account is now verified", 
		user: {
			name: user.name, 
			email: user.email, 
			id: user._id, 
			token 
		}
	});
} 