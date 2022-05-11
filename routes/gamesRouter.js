import { Router } from "express"

import { getAllGames, getGameById } from "../controllers/gamesController.js"

const gamesRouter = Router()

gamesRouter.get("/games", getAllGames)
gamesRouter.get("/games/:id", getGameById)

export default gamesRouter
