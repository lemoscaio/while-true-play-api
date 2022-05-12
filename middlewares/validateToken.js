import db from "../db.js"

export async function validateToken(req, res, next) {
    // Header Destructuring
    const { authorization } = req.headers

    // Checking if token has been sent
    const token = authorization?.replace("Bearer ", "").trim()
    if (!token) return res.sendStatus(401)

    try {
        // Checking token existence
        const session = await db.collection("sessions").findOne({ token })
        if (!session) return res.sendStatus(401)

        // Checking if token belongs to user
        const user = await db.collection("users").findOne({
            _id: session.userId,
        })
        if (!user) return res.sendStatus(401)

        // Deleting potentially harmful information
        delete user.password
        // Saving user variable for later usage
        res.locals.user = user
    } catch (e) {
        return res.sendStatus(500)
    }
    // Advancing to next function
    next()
}
