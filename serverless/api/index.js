const express = require("express")
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const cors = require("cors")
const meals = require("./routes/meals")
const orders = require("./routes/orders")
const auth = require("./routes/auth")



const app = express()
app.use(bodyparser.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})

app.use("/api/meals",meals)
app.use("/api/orders",orders)
app.use("/api/auth",auth)



module.exports = app