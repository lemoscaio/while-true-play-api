import { Router } from "express"
import { buyGame } from "../controllers/checkoutController.js"
import { validateCheckoutInfo } from "../middlewares/validateCheckoutInfo.js"
import { validateToken } from "../middlewares/validateToken.js"

const checkoutRouter = Router()

checkoutRouter.post("/checkout", validateCheckoutInfo, validateToken, buyGame)

export default checkoutRouter
