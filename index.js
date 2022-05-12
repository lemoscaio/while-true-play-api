import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import gamesRouter from "./routes/gamesRouter.js"
import usersRouter from "./routes/usersRouter.js"
import checkoutRouter from "./routes/checkoutRouter.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Routers
app.get("/", (req, res) => {
    res.send("Online")
})
app.use(gamesRouter)
app.use(usersRouter)
app.use(checkoutRouter)

app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
)
