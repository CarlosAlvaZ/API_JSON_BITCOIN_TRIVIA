import { QuestionService } from "../Services/QuestionServices.js";

export const QuestionController = {
    getOne : async (req, res) => {
        const { id } = req.params
        const question = await QuestionService.getOne(id)

        return res.status(200).json({
            status : 200,
            data : question
        })
    },
    checkAnswer : async (req, res) => {
        const { id, answer } = req.body
        const question = await QuestionService.getOne(id)
        const correctAnswer = question[0].correctAnswer
        const check = correctAnswer == answer

        return res.status(200).json({
            status : 200,
            data : check
        })
    }
}