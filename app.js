require('dotenv').config()
require('express-async-errors');
const express = require('express')
const session = require('express-session');
const cors = require('cors')
const apiRouter = require('./route')
const {get_league_teams} = require('./get_all_teams')
const notFound = require('./not-found')
const axios = require('axios');
const api_key = process.env.API_KEY;
const fs = require('fs')
const app = express()

app.use(cors())

app.use('/api', apiRouter)

app.use(notFound)

const port = process.env.PORT || 3000

const start = async () => {
    try{
        //connect DB
        // await connectDB()
        // console.log("Connected to DB")
        app.listen(port, "0.0.0.0", console.log(`Server is listening to port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start();

// get_league_teams()
