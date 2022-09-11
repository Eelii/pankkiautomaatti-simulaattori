import express, { Express, Request, Response } from 'express'
import cors from 'cors'

const app: Express = express()
app.use(cors())

const CORRECT_PIN_NUMBER = 1337

app.get('/checkPin', function (req: Request, res: Response) {
    const pin = req.query.pin as string
    if(pin){
        res.send({pinCorrect: parseInt(pin) === CORRECT_PIN_NUMBER})
    } else {
        res.status(400).send("PIN must contain only numbers")
    }
})
  
app.listen(3001)
console.log("Server running on port 3001")