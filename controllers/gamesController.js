import db from "./../db.js"

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
