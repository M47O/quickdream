require("dotenv").config({ path: "./config/.env" });

const express = require("express")
const cors = require("cors")
const app = express()
const logger = require("morgan")
const connectDB = require("./config/database")

const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')

app.use(cors({ origin: 'https://quickdream1.vercel.app' }))

connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger("dev"));

// Routes // 
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)


app.listen(process.env.PORT, console.log(`Server running on port ${process.env.PORT}`))