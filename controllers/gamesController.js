import db from "./../db.js"

export async function getAllGames(req, res) {
    // Get query strings
    const gameTitleQuery = req.query.q
    const order = req.query.order
    const limit = parseInt(req.query.limit)

    // Creating regex for querying the database
    const gameTitleRegex = new RegExp(`[\\.]*${gameTitleQuery}[\\.]*`, "i")

    // Treating order query data
    const orderRegex = new RegExp("(\\w*):(\\w*)")
    const orderKey = order?.match(orderRegex)[2]
    const orderValue = order?.match(orderRegex)[1]
    const sortDirection = (() => {
        if (orderValue === "desc") return -1
        else if (orderValue === "asc") return 1
    })()

    // Creating query object for database
    const query = {
        ...(gameTitleQuery && { title: gameTitleRegex }),
    }
    // Creating options object for database
    const options = {
        ...(limit && { limit: limit }),
        ...(order && { sort: { [orderKey]: sortDirection } }),
    }

    try {
        // Get games from database
        const games = await db
            .collection("games")
            .find(query, options)
            .toArray()
        // Return if doesn't exist
        if (!games) return res.status(404).send("Couldn't find games")
        // Return list of games
        res.send(games)
    } catch (error) {
        res.status(500).send("Something went wrong retrieving the data")
    }
}

export async function getGameById(req, res) {
    // Converting ID to be recognized by collection
    const id = parseInt(req.params.id)
    // Destructuring collection
    const gamesCollection = db.collection("games")
    try {
        // Checking if game exists
        const game = await gamesCollection.findOne({ id: id })
        if (game) {
            // Raising view count
            await gamesCollection.updateOne(
                {
                    id: id,
                },
                {
                    $set: {
                        views: game.views + 1,
                    },
                }
            )

            // Removing private information
            delete game._id
            res.status(200).send(game)
        } else {
            res.status(404).send()
        }
    } catch (e) {
        console.log(e)
        res.status(401).send()
    }
}
