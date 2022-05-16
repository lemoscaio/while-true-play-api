import db from "./../db.js"
import sgMail from "@sendgrid/mail"

export async function buyGame(req, res) {
    const { email, userId } = res.locals
    const { games } = req.body

    // Destructuring collection
    const gamesCollection = db.collection("games")

    games.forEach(async (game) => {
        try {
            await gamesCollection.updateOne(
                {
                    id: game.id,
                },
                {
                    $inc: {
                        amountSold: 1,
                    },
                }
            )
        } catch (err) {
            res.sendStatus(500)
        }
    })

    try {
        const user = await db.collection("users").findOne({ _id: userId })

        const newGames = [...user.games, ...games]

        try {
            await db
                .collection("users")
                .updateOne(
                    { _id: user._id },
                    { $set: { games: newGames, gamesInCart: [] } }
                )
            // Setting up email

            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: email,
                from: "patrickandradepatrick@hotmail.com", // Change to your verified sender
                subject: "Purchase at While(true)Play Store",
                text: "Thank you for buying at our store! We hope to see you again soon.",
                html: "<strong>Thank you for buying at our store! We hope to see you again soon.</strong>",
            }
            sgMail
                .send(msg)
                .then(() => {})
                .catch(() => {})

            res.status(200).send()
        } catch (e) {
            res.status(500).send(e)
        }
    } catch (e) {
        res.status(500).send(e)
    }
    // Inserting new games into user's database entry
}
