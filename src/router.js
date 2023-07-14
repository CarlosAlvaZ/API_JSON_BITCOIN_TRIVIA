import { Router } from "express";
import { GameController } from "./Controllers/GameController.js";
import { QuestionController } from "./Controllers/QuestionController.js";

const router = Router()

// Rutas Game
router.get('/createGame', GameController.createGame)
router.get('/updateGameStatus/:id', GameController.updateGameStatus)
router.get('/getStatus/:id', GameController.getStatus)

// Rutas Question
router.get('/getQuestion/:id', QuestionController.getOne)
router.get('/checkAnswer/', QuestionController.checkAnswer)

export default router