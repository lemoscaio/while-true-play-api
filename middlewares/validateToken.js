import db from "../db.js"
import jwt from "jsonwebtoken"

export async function validateToken(req, res, next) {
    // Requisition Destructuring
    const { email } = req.body
    // Header Destructuring
    const { authorization } = req.headers

    // Checking if token has been sent
    const token = authorization?.replace("Bearer ", "").trim()
    if (!token) return res.sendStatus(401)

    try {
        // Checking token existence
        const session = await db.collection("sessions").findOne({ token })
        if (!session) return res.sendStatus(401)
        // Checking token expiration date and validity
        const data = jwt.verify(token, process.env.JWT_SECRET)

        // Checking if token belongs to user
        const user = await db.collection("users").findOne({
            _id: session.userId,
        })
        if (!user) return res.sendStatus(401)

        // Deleting potentially harmful information
        delete user.password
        // Saving user variable for later usage
        res.locals.user = user
        res.locals.session = session
    } catch (e) {
        return res.sendStatus(500)
    }
    // Advancing to next function
    next()
}
