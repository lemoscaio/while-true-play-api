import joi from "joi"

// Account information pattern
const buyGameSchema = joi.object({
    games: joi.array().items(joi.number()).required(),
})
// Add email later for bonus

export default buyGameSchema
