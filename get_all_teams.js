const axios = require('axios');
const api_key = process.env.API_KEY;
const fs = require('fs')

const id = ['152', '302', '207','168','175', '3', '4','146', '147','278', '332','633', '153', '377', '383', '300', '165','205',   '372', '29','7098']// league ids
// const id = ['3 champions leageu', '4  europa league', '633 Uefa nations League', '302 laliga', '152 premierleague', '175 bundesliga','207 seria', '168 lig1',  '147 leaguecup', '153 championship', '377 communityshield', '383', '300 copadelray', '165 coupedefrance','205 copaitalia', '278 saudileague', '332 mls', '372 uefasupercup', '29 caf','7098']// league ids

const getLivescore = async () => {
    try {
        const data = {}
        // let id = 19698
        for (let index = 0; index < 19801; index++) {
            const response = await axios.get(`https://apiv3.apifootball.com/?action=get_teams&team_id=${index}&APIkey=${api_key}`)
            // id++
            // console.log(response.data);
            res_data = response.data

            if(res_data.error) console.log("error")
            else {
                if(res_data[0].team_name && res_data.length > 0){
                    //if leage id 
                    data[res_data[0].team_name] = res_data[0].team_key
                    fs.writeFile('data.json', JSON.stringify(data, null, 4), (err) => {
                        if (err) throw err;
                        console.log('Data saved to data.json');
                    });
                } else {
                    console.log(" no data")
                }
            }
            
            console.log(index);
            
        }

       

    } catch (error) {
        console.error(`Error fetching livescore data: ${error.message}`);
    }
};

function orderDictionary(originalDict, orderList) {
    const orderedDict = {};
  
    // Iterate over the orderList
    orderList.forEach((key) => {
      // Check if the key is present in the original dictionary
      if (originalDict.hasOwnProperty(key)) {
        // Add the key-value pair to the ordered dictionary
        orderedDict[key] = originalDict[key];
      }
    });
  
    return orderedDict;
  }
  

const get_league_teams = async () => {
    try {
        
        // let id = 19698
        // const id = ['3', '4', '633', '302', '152', '175','207', '168', '146', '147', '153', '377', '383', '300', '165','205', '278', '332', '372', '29','7098']// league ids
        let allData = {}
        let allData2 = {}
        const myMap = new Map();
        
        for(const i of id){
            const data = {}
            const data2 ={}
            const response = await axios.get(`https://apiv3.apifootball.com/?action=get_teams&league_id=${i}&APIkey=${api_key}`)
                // id++
            console.log(response.data.length);
            res_data = response.data

            let list_ids = []
            for (const d of res_data) {
                data[d.team_name] = d.team_key  
                // [...data, ...res_data] 
                list_ids.push(d.team_key)
            }
            data2[i] =  list_ids
            // Use Object.assign() to merge the two dictionaries
            allData = Object.assign({}, allData, data);

            myMap.set(i,list_ids);
            // Convert Map to an object

            fs.writeFile(`data/data.json`, JSON.stringify(allData, null, 4), (err) => {
                if (err) throw err;
                console.log('Data saved to data.json');
            });

          

        }

        const myObject = Object.fromEntries(myMap);
        // console.log(myObject)

        fs.writeFile(`data/league_ids.json`, JSON.stringify(myObject, null, 4), (err) => {
            if (err) throw err;
            console.log('Data2 saved to league.json');
        });

    } catch (error) {
        console.error(`Error fetching livescore data: ${error.message}`);
    }
};

module.exports = {
    get_league_teams,
    id
}