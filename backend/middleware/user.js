const { isValidObjectId } = require('mongoose');
const ResetToken = require('../models/resetToken');
const User = require('../models/userModel');
 
exports.isResetTokenValid = (req, res, next) => {
	const {token, id} = req.query;

	if(!token || !id) return res.status(400).json({success: false, error: 'Invalid request!'});

	if(isValidObjectId(id)) return res.status(400).json({success: false, error: 'Invalid user!'});

	const user = await User.findById(id);
	if(!user) return res.status(400).json({success: false, error: 'User not found!'});

	const resetToken = await ResetToken.findOne({owner: user._id});
	if(!resetToken) return res.status(400).json({success: false, error: 'Reset Token not found!'});
	
	const isValid = await resetToken.compareToken(token);

	if(!isValid) return res.status(400).json({success: false, error: 'Invalid Reset Token!'});
	req.user = user;
	next();
};