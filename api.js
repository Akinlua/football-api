
const axios = require('axios');
const {search_id, readFile} = require('./search_clubID')
const {id} = require('./get_all_teams')
const fs = require('fs');


const api_key = process.env.API_KEY;

const today_date = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    return today
}

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

function findKeysWithValue(dictionary, value1, value2) {
    const matchingKeys = [];
  
    // Loop through each key in the dictionary
    for (const key in dictionary) {
      if (Object.hasOwnProperty.call(dictionary, key)) {
        const array = dictionary[key];
  
        // Check if value1 or value2 is in the array
        if (array.includes(value1) && array.includes(value2)) {
          matchingKeys.push(key);
        }
      }
    }
  
    return matchingKeys;
}
  

const getLivescore = async (req, res) => {
    try {

        const {team1, team2} = req.query

        if(!team1 || !team2){
            return res.json({
                "status": 404,
                "error": "No team name is provided"
            })
        }
        console.log("check")
        // get id for each team based on name
        const searched1 = await search_id(team1)
        const searched2 = await search_id(team2)
        console.log(searched1, searched2)

        if(searched1.id == undefined || searched2.id == undefined) {
            return res.json({
                "status": 404,
                "error": "The team name provided doesn't exist"
            })
        }

        //check the league id both belong to
        
        const leagueIDs = await readFile('data/league_ids.json')

        // get the ids that the both team belong to
        const found_league_ids_ = findKeysWithValue(leagueIDs, searched1.id, searched2.id);
        console.log(found_league_ids_)
         // Order the first list based on the reference list
        const found_league_ids = orderList([...found_league_ids_], id);
        
        console.log(found_league_ids);
  

        // store match details based on the searched value from params
        let match_details = {}
        // get today's date
        const date = await today_date()

        // all matches 
        let data = []
        let found = false
        for (const i of found_league_ids){
            console.log(i)
            const response = await axios.get(`https://apiv3.apifootball.com/?action=get_events&&from=${date}&to=${date}&league_id=${i}&APIkey=${api_key}`)
            const res_data = response.data
            if(Array.isArray(res_data) && res_data.length > 0 ){
                console.log(res_data.length)
                for (const d of res_data) {
                    if(d.match_hometeam_id == searched1.id && d.match_awayteam_id == searched2.id || d.match_hometeam_id == searched2.id && d.match_awayteam_id == searched1.id ){
                        console.log(true)
                        found = true
                        match_details = d
                        break
                    }
                }

                if(found == true) break
                // data = [...data, ...res_data]
            }
        }
        
        console.log(match_details)
        res.json({
            "status": 200,
            "match_details": match_details
        })
    } catch (error) {
        
        console.error(`Error fetching livescore data: ${error.message}`);
        return res.json({
            "status": 500,
            "error": `Error fetching livescore data: ${error.message}`
        })
    }
};

const getAllFeatures = async (req, res) => {
    try {

        const major_ids = ['152', '302', '207','168','175', '3', '4','146', '147',]

        const date = await today_date()
        let match_details = {}
        let all_matches = []
        for (const i of major_ids){
            console.log(i)
            const response = await axios.get(`https://apiv3.apifootball.com/?action=get_events&&from=${date}&to=${date}&league_id=${i}&APIkey=${api_key}`)
            const res_data = response.data
            if(Array.isArray(res_data) && res_data.length > 0 ){
                console.log(res_data.length)
                for (const d of res_data) {
                    all_matches.push(d)
                }
            }
        }

        console.log(all_matches.length)
        res.json({
            "status": 200,
            "all_matches": all_matches
        })
    } catch (error) {
        console.error(`Error fetching livescore data: ${error.message}`);
        return res.json({
            "status": 500,
            "error": `Error fetching livescore data: ${error.message}`
        })
    }
}

module.exports = {
    getLivescore,
    getAllFeatures
}