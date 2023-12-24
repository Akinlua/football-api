const express = require('express')
const router = express.Router()

const {
    getLivescore, getAllFeatures
} = require('./api')

router.get('/get_live_details', getLivescore)
router.get('/get_all_matches', getAllFeatures)


module.exports = router