const notFound = async (req, res) =>  {

    return res.json({
        status: 404,
        error: "Url not found",
    }) 
}

module.exports = notFound
