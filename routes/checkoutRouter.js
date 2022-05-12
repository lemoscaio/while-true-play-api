import { Router } from "express"
import { buyGame } from "../controllers/checkoutController.js"
import { validateCheckoutInfo } from "../middlewares/validateCheckoutInfo"
import { validateToken } from "../middlewares/validateToken"

const checkoutRouter = Router()

checkoutRouter.post("/checkout", validateCheckoutInfo, validateToken, buyGame)

export default checkoutRouter
