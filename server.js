const { readdirSync } = require("fs");
const express = require('express');
const app = express();
require("dotenv").config();

// Security Middleware
const helmet = require('helmet');
const morgan = require("morgan");
const cors = require('cors');

// Set Request Limit per minute for 1 IP
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 60, // Limit each IP to 10 requests per `window` (here, per 1 minutes)
})


// Database Middleware
const mongoose = require("mongoose");


// Security Middlewares Implement
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(limiter);


// Routes middleware
readdirSync("./routes").map(r => app.use("/api/v1", require(`./routes/${r}`)))


// Server
const port = process.env.PORT || '8000';

// Connect to DB and start server
mongoose
    .connect(process.env.DATABASE)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server Running on port http://localhost/${port}`);
        });
    })
    .catch((err) => console.log(err));