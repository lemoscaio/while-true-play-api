import signupSchema from "./schemas/signupSchema.js"

export async function validateSignUpInfo(req, res, next) {
    // Checking if all necessary information is present and valid
    const validation = signupSchema.validate(req.body)
    if (validation.error) {
        return res.sendStatus(422)
    }
    // Advancing to next function
    next()
}
