import db from "./../db.js"
import jwt from "jsonwebtoken"

export async function buyGame(req, res) {
    try {
        // Destructuring request and renaming for practicity
        const { games: newGames } = req.body
        // Destructuring previous info
        const { user } = res.locals

        // Separating object for prcticity
        const oldGames = user.games
        // Creating a new array with all the games the user currently possesses
        const totalGames = oldGames.concat(newGames)

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
