import { Router } from "express"
import {
    signUp,
    signIn,
    getUserInfo,
    addGameToCart,
} from "./../controllers/usersController.js"
import { validateSignUpInfo } from "./../middlewares/validateSignUpInfo.js"
import { validateSignInInfo } from "./../middlewares/validateSignInInfo.js"
import { validateToken } from "./../middlewares/validateToken.js"

const usersRouter = Router()

usersRouter.post("/sign-up", validateSignUpInfo, signUp)
usersRouter.post("/sign-in", validateSignInInfo, signIn)
usersRouter.get("/user", validateToken, getUserInfo)
usersRouter.put("/cart", validateToken, addGameToCart)

export default usersRouter
