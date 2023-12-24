require('dotenv').config()
require('express-async-errors');
const express = require('express')
const session = require('express-session');
const cors = require('cors')
const apiRouter = require('./route')
const {get_league_teams} = require('./get_all_teams')

const axios = require('axios');
const api_key = process.env.API_KEY;
const fs = require('fs')
const app = express()

app.use(cors())

app.use('/api', apiRouter)



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

function orderList(listToOrder, referenceList) {
    // Create a map to store the indices of elements in the reference list
    const indexMap = new Map();
    referenceList.forEach((element, index) => {
      indexMap.set(element, index);
    });
  
    // Sort the list to order based on the indices in the reference list
    listToOrder.sort((a, b) => {
      const indexA = indexMap.get(a);
      const indexB = indexMap.get(b);
  
      // If both elements are in the reference list, compare their indices
      if (indexA !== undefined && indexB !== undefined) {
        return indexA - indexB;
      }
  
      // If one element is in the reference list and the other is not,
      // prioritize the element that is in the reference list
      if (indexA !== undefined) {
        return -1;
      } else if (indexB !== undefined) {
        return 1;
      }
  
      // If neither element is in the reference list, maintain their original order
      return 0;
    });
  
    return listToOrder;
  }
  
  // Example lists
  const firstList = ["3", "1", "2"];
  const referenceList = ["2", "8",  "1", "11", "3", "4", "6"];
  
  // Order the first list based on the reference list
  const orderedList = orderList([...firstList], referenceList);
  
  console.log(orderedList);
  