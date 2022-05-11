import joi from "joi"

// Account information pattern
const signupSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
})

export default signupSchema
