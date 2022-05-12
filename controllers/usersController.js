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
            // Params for jwt token
            const data = { email }
            // Secret key in .env file
            const secretKey = process.env.JWT_SECRET
            // 15 minutes in seconds.
            const settings = { expiresIn: 60 * 15 }
            // Token made up by the Data, encrypted by the Secret key, expiring in 15 minutes.
            const token = jwt.sign(data, secretKey, settings)

            // Inserting token into the database collection
            await db.collection("sessions").insertOne({
                userId: user._id,
                token,
            })

            // Removing sensitive information
            delete user.password
            delete user._id
            // Sending necessary information
            res.status(200).send({ user, token })
        } else {
            // Account/Email does not exist
            res.status(401).send("Email or password is incorrect.")
        }
    } catch (e) {
        // Connection to Database failed
        console.log("Connection error! ", e)
        res.status(500).send()
    }
}
