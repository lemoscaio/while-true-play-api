import joi from "joi"

// Account information pattern
const buyGameSchema = joi.object({
    games: joi.array().min(1).required(),
})

export default buyGameSchema
