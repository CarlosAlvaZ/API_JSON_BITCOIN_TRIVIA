import Question from "../Models/QuestionModel.js";

export const QuestionService = {
    getAll : options => {
        try {
            return Question.find({...options})
        } catch (error) {
            return error
        }
    },
    getOne : id => {
        try {
            return Question.find({ id : id })
        } catch (error) {
            return error
        }
    }
}