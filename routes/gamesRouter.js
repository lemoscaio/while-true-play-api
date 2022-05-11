import { Router } from "express"

import { getGameById } from "../controllers/gamesController.js"

const gamesRouter = Router()

gamesRouter.get("/games/:id", getGameById)

export default gamesRouter