import { Router } from "express"
import { signUp } from "./../controllers/usersController.js"
import { validateSignUpInfo } from "./../middlewares/validateSignUpInfo.js"

const usersRouter = Router()

usersRouter.post("/sign-up", validateSignUpInfo, signUp)

export default usersRouter
