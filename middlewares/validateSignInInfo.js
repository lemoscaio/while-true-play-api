import signinSchema from "./schemas/signinSchema.js"

export async function validateSignInInfo(req, res, next) {
    // Checking if all necessary information is present and valid
    const validation = signinSchema.validate(req.body)
    if (validation.error) {
        return res.sendStatus(422)
    }
    // Advancing to next function
    next()
}
