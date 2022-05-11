import db from "./../db.js"

export async function getAllGames(req, res) {
    // Get query strings
    const gameTitleQuery = req.query.q
    // Create regex for querying the database
    const gameTitleRegex = new RegExp(`[\\.]*${gameTitleQuery}[\\.]*`, "i")

    // TODO improve existing option cases instead of repeating code
    try {
        // Get games from database
        let games
        if (gameTitleQuery) {
            games = await db
                .collection("games")
                .find({ title: gameTitleRegex })
                .toArray()
        } else {
            games = await db.collection("games").find({}).toArray()
        }

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
