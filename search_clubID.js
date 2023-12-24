const Fuse = require('fuse.js');
// const footballClubs = require('./football');
const fs = require('fs');

const fuse_search = (array, inputName) => {
    // find best match
    const fuseOptions = {
        keys: ['name'],
        includeScore: true,
        shouldSort: true,
        threshold: 0.8, // Adjust the threshold based on your preference
    };

    // Create a new instance of Fuse
    const fuse = new Fuse(array, fuseOptions);

    // Perform the fuzzy search
    const results = fuse.search(inputName);
    if (results.length > 0) {
        const bestMatch = results[0].item;
        return bestMatch
    } else {
        return null
    }
}

function readFile(name) {
    return new Promise((resolve, reject) => {
        fs.readFile(`${name}`, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}


const search_id = async (name) => {
    
    
    const footballClubs = await readFile('data/data.json')

    let club 
    // Input variable with a particular name
    let inputName = name; // Replace this with the     actual variable you have
    inputName = inputName.toLowerCase()
    inputwords = inputName.split(/\s+/);
    // Find the ID associated with the input name
    let id = footballClubs[name];
    club = name

    if (id !== undefined) {
        console.log(`The ID for ${inputName} is ${id}`);
    } else {
        //if id is undefined, search again using PARTIAL MATCH

        // save to an array
        const foundNames = []
        for (const name of Object.keys(footballClubs)) {
            const lowerName = name.toLowerCase();
            if (inputwords.every((word) => lowerName.includes(word))) {
                foundNames.push(name)
            }
        }

        console.log(foundNames)
        if(foundNames.length <= 0) id = undefined
        else if (foundNames.length == 1){
            id = footballClubs[foundNames[0]];
            club = foundNames[0]
        }
        else {
            // use fuse_search to get best match
            const best_match = fuse_search(foundNames, inputName)
            
            if (best_match != null) {
                id = footballClubs[best_match];
                console.log(`The best match for ${inputName} is ${best_match} with ID ${id}`);
                club = best_match
            } else {
                console.log(`No match found for ${inputName}`);
                id = footballClubs[foundNames[0]];
                club = foundNames[0]
            }
        }
            
        
        if (id !== undefined) {
            console.log(`The ID for ${inputName} or similar is ${id}`);
        } else {
            //if id is undefined, search againing using FUZE
            // Convert the dictionary keys to an array of objects for fuzzy searching
            const keysArray = Object.keys(footballClubs).map(name => (name));

            const best_match = fuse_search(keysArray, inputName)

            if (best_match != null) {
                id = footballClubs[best_match];
                console.log(`The best match for ${inputName} is ${best_match} with ID ${id}`);
                club = best_match
            } else {
                console.log("No match found. Please check your input.");
                id = undefined
                club = "Not Found"
            }

        }
    }

    return {"id": id, "club": club}
}

module.exports = {
    search_id,
    readFile
}