const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const port = process.env.PORT || 8080;

connectDB();
const app = express();

app.use(cors);
app.use(express.json());

app.use('/api/user', userRoutes);

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});