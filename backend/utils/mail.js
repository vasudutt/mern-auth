const nodemailer = require('nodemailer');

exports.generateOtp = () => {
	let otp = ''
	for(let i = 0; i <=3; i++){
		const randVal = Math.round(Math.random() * 9);
		otp = otp + randVal;
	}
	return otp;
}

exports.mailTransport = () => nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: process.env.MAILTRAP_USERNAME,
		pass: process.env.MAILTRAP_PASSWORD
	}
});

exports.generateEmailTemplate = code => {
	return (`
	<html>
	<body>
		<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
			<div style="margin:50px auto;width:70%;padding:20px 0">
			<div style="border-bottom:1px solid #eee">
				<a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">MERN-Auth</a>
			</div>
			<p style="font-size:1.1em">Hi,</p>
			<p>Thank you for registering with us. Use the following OTP to verify your email. OTP is valid for 1 hour</p>
			<h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
			<p style="font-size:0.9em;">Regards,<br />MERN-Auth</p>
			<hr style="border:none;border-top:1px solid #eee" />
			<div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
				<p>Designed by</p>
				<p>Vasu Dutt</p>
			</div>
			</div>
		</div>
	</body>
	</html>
	`)
}

exports.plainEmailTemplate = () => {
	return (`
		<html>
			<body>
				<p>Thank you! Ypur account is now verified</p>
			</body>
		</html>
	`)
}