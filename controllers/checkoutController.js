import db from "./../db.js"

export async function buyGame(req, res) {
    try {
        // Destructuring request and renaming for practicity
        const { games: newGames, email } = req.body
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

        const sgMail = require("@sendgrid/mail")
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: email,
            from: "patrickandradepatrick@hotmail.com", // Change to your verified sender
            subject: "Purchase at While(true) Play Store",
            text: "Thank you for buying at our store! We hope to see you again soon.",
            html: "<strong>Thank you for buying at our store! We hope to see you again soon.</strong>",
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log("Email sent")
            })
            .catch((error) => {
                console.error(error)
            })

        res.status(201).send()
    } catch (e) {
        console.log(e)
        res.status(401).send()
    }
}
