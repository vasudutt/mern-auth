const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const port = process.env.PORT || 8080;

connectDB();
const app = express();

const whitelist = ["http://localhost:3000", "http://localhost:8080/", "http://localhost:5000/"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log(origin);
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('hello');
})
app.use('/api/user', userRoutes);

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});