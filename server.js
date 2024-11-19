const dotenv = require("dotenv")
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require("method-override")
const morgan = require("morgan")

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))
app.use(morgan("dev"))

const Fruit = require('./models/fruit.js')

app.get("/", async (req, res) => {
    res.render("index.ejs")
})

app.delete('/fruits/:fruitId', async (req, res)=>{
    await Fruit.findByIdAndDelete(req.params.fruitId)
    res.redirect("/fruits")
})

app.get("/fruits/:fruitId/edit", async (req, res) =>{
    const foundFruit = await Fruit.findById(req.params.fruitId)
    res.render("fruits/edit.ejs", {
        fruit: foundFruit,
    })
})

app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.ejs")
})

app.get('/fruits', async (req, res) => {
    const allFruits = await Fruit.find()
    res.render('fruits/index.ejs', {
        fruits: allFruits
    })
})

app.put("/fruits/:fruitId", async (req, res) => {
    if (req.body.isReadyToEat === "on"){
        req.body.isReadyToEat = true
    } else {
        req.body.isReadyToEat = false
    }
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body)
    res.redirect(`/fruits/${req.params.fruitId}`)
})

app.post("/fruits", async (req, res) => {
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body)
    res.redirect("/fruits")
})

app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId)
    res.render("fruits/show.ejs", { fruit: foundFruit })
})

app.listen(3001, () => {
    console.log("Listening on port 3001")
})

