import db from "./../db.js"
import bcrypt from "bcrypt"

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
