import buyGameSchema from "./schemas/buyGameSchema.js"

export async function validateCheckoutInfo(req, res, next) {
    // Checking if all necessary information is present and valid
    const validation = buyGameSchema.validate(req.body)
    if (validation.error) {
        return res.sendStatus(422)
    }

    // Advancing to next function
    next()
}
