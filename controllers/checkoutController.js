import db from "./../db.js"

export async function buyGame(req, res) {
    try {
        // Destructuring request and renaming for practicity
        const { games: newGames } = req.body
        // Destructuring previous info
        const { user, session } = res.locals

        // Separating object for prcticity
        const oldGames = user.games
        // Creating a new array with all the games the user currently possesses
        const totalGames = oldGames.concat(newGames)

        // Destructuring collection
        const gamesCollection = db.collection("games")

        for (let i = 0; i < newGames.length; i++) {
            // Current game's ID
            const gameId = newGames[i]

            // Updating amount sold of current game
            await gamesCollection.updateOne(
                {
                    id: gameId,
                },
                {
                    $inc: {
                        "amount-sold": 1,
                    },
                }
            )
        }

        // Inserting new games into user's database entry
        await db
            .collection("users")
            .updateOne({ _id: session.userId }, { $set: { games: totalGames } })
        // Finishing process
        console.log("New games bought and added successfully.")
        res.status(201).send()
    } catch (e) {
        console.log(e)
        res.status(401).send()
    }
}
