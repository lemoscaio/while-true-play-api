import db from "../db.js"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"

export async function validateToken(req, res, next) {
    // Header Destructuring
    const { authorization } = req.headers

    const regexResult = authorization?.match(/^(Bearer )/g)
    if (!regexResult)
        return res
            .status(400)
            .send(
                "You must pass an authorization token in the request header beginning with 'Bearer '"
            )

    // Checking if token has been sent
    const token = authorization?.replace("Bearer ", "").trim()
    if (!token) return res.sendStatus(401)

    try {
        // Checking token expiration date and validity
        const data = jwt.verify(token, process.env.JWT_SECRET)

        try {
            // Checking session existence
            const session = await db
                .collection("sessions")
                .findOne({ _id: new ObjectId(data.sessionId) })

            if (!session) return res.status(401).send("Session not found")

            // Checking if token belongs to user
            try {
                const user = await db.collection("users").findOne({
                    _id: session.userId,
                })
                if (!user) return res.status(401).send("User not found")

                // Deleting potentially harmful information
                delete user.password
                // Saving user variable for later usage
                res.locals.userId = user._id
                res.locals.email = user.email
            } catch (e) {
                return res.sendStatus(500)
            }
        } catch (e) {
            return res.status(500).send(e)
        }
    } catch (e) {
        return res.status(401).send(e.name)
    }
    // Advancing to next function
    next()
}
