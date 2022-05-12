import { Router } from "express"
import { signUp, signIn } from "./../controllers/usersController.js"
import { validateSignUpInfo } from "./../middlewares/validateSignUpInfo.js"
import { validateSignInInfo } from "./../middlewares/validateSignInInfo.js"

const usersRouter = Router()

usersRouter.post("/sign-up", validateSignUpInfo, signUp)
usersRouter.post("/sign-in", validateSignInInfo, signIn)

export default usersRouter
