import joi from "joi"

// Account information pattern
const signupSchema = joi.object({
    name: joi
        .string()
        .pattern(/^[\wãÃÇ-Üá-ú ]*$/i)
        .required(),
    email: joi.string().email().required(),
    password: joi
        .string()
        .pattern(/^\S{6,20}$/)
        .required(),
})

export default signupSchema
