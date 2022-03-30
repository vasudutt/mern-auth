const { check, validationResult } = require('express-validator');

exports.validateUser = [
	check("name")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Name is Missing!")
		.isLength({ min: 3, max: 50})
		.withMessage("Name must be 3 to 50 characters long"),
	check("email")
		.normalizeEmail()
		.isEmail()
		.withMessage("Email is invalid"),
	check("password")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Password is Missing!")
		.isLength({ min: 8, max: 50})
		.withMessage("Name must be 8 to 50 characters long"),
];

exports.validate = (req, res, next) => {
	const error = validationResult(req).array();
	if(!error.length) return next();
	
	res.status(400).json({ success: false, error: error[0].msg });
}