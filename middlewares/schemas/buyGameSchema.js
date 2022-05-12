import joi from "joi"

// Account information pattern
const buyGameSchema = joi.object({
    games: joi.array().items(joi.number()).required(),
    email: joi.string().email().required(),
})

export default buyGameSchema
