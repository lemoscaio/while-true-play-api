import db from "./../db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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

        console.log(password)

        // Encrypting password for security
        const passwordHash = bcrypt.hashSync(trimmedPassword, 10)
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
        console.log("Connection error! ", e)
        res.status(500).send()
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
                const minutes = 15
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
        // Connection to Database failed
        console.log("Connection error! ", e)
        res.status(500).send()
    }
}
