import db from "./../db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ObjectId from "mongodb"

export async function signUp(req, res) {
    // Requisition Destructuring
    const { name, email, password } = req.body
    // Collection Destructuring
    const usersCollection = db.collection("users")

    try {
        // Checking if email already exists in Database
        const exists = await usersCollection.findOne({ email })
        if (exists) {
            return res.status(409).send("Email already in use.")
        }
        // Encrypting password for security
        const passwordHash = bcrypt.hashSync(password, 10)
        // Inserting user into database
        await usersCollection.insertOne({
            name,
            email,
            password: passwordHash,
            image: "",
            games: [],
        })
        // Return success.
        res.status(201).send("Account created succesfully.")
    } catch (e) {
        // Return connection fail event
        res.status(500).send(e)
    }
}

export async function signIn(req, res) {
    // Requisition Destructuring
    const { email, password } = req.body
    // Collection Destructuring
    const usersCollection = db.collection("users")

    try {
        // Checking if user is registered.
        const user = await usersCollection.findOne({ email: email })

        if (user && bcrypt.compareSync(password, user.password)) {
            // Inserting user into the session collection
            try {
                const result = await db.collection("sessions").insertOne({
                    userId: user._id,
                })

                // Params for jwt token
                const data = { sessionId: result.insertedId }
                // Secret key in .env file
                const secretKey = process.env.JWT_SECRET
                // 15 minutes in seconds.
                const secondsInMinute = 60
                const minutes = 60
                const settings = { expiresIn: secondsInMinute * minutes }
                try {
                    // Token made up by the Data, encrypted by the Secret key, expiring in 15 minutes.
                    const token = jwt.sign(data, secretKey, settings)

                    // Sending necessary information
                    res.status(200).send(token)
                } catch (err) {
                    res.status(500).send(
                        "Couldn't create login token: " + e.message
                    )
                }
            } catch (e) {
                return res
                    .status(500)
                    .send("Couldn't create login session: " + e.message)
            }
        } else {
            // Account/Email does not exist
            return res.status(401).send("Email or password is incorrect.")
        }
    } catch (e) {
        res.status(500).send()
    }
}

export async function getUserInfo(req, res) {
    const { userId } = res.locals

    try {
        const usersCollection = db.collection("users")

        const user = await usersCollection.findOne({
            _id: userId,
        })

        if (!user) return res.status(404).send("User not found")

        delete user.password
        delete user._id

        return res.send(user)
    } catch (err) {
        return res.status(401).send(err)
    }
}

export async function addGameToCart(req, res) {
    const { userId } = res.locals
    const { newGame } = req.body

    try {
        const usersCollection = db.collection("users")
        const user = await usersCollection.findOne({
            _id: userId,
        })
        if (!user) return res.status(404).send("User not found")

        if (
            user.gamesInCart?.some((gameInCart) => gameInCart.id === newGame.id)
        )
            return res.status(409).send("The game was already in the cart")

        try {
            if (!user.gamesInCart) {
                user.gamesInCart = []
            }
            const newGamesInCart = [...user.gamesInCart, newGame]

            const result = await usersCollection.updateOne(
                { _id: user._id },
                { $set: { gamesInCart: newGamesInCart } }
            )

            if (result.modifiedCount === 1 && result.matchedCount === 1) {
                return res.status(200).send("Successfully updated")
            } else if (
                result.matchedCount === 1 &&
                result.modifiedCount === 0
            ) {
                return res.status(400).send("Data must be different to update")
            }
        } catch (err) {
            res.status(500).send(err)
        }
    } catch (err) {
        res.status(500).send(err)
    }
}
