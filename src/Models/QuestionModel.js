import mongoose, {Schema, model} from "mongoose";

const QuestionSchema = Schema({
    question : {
        type : String,
    },
    answers : {
        type : Array
    },
    correctAnswer : {
        type : String
    },
    difficultyLevel : {
        type : Number
    },
    subject : {
        type : String
    }
}, { collection : "Questions" })

const Question = model('Question', QuestionSchema)

export default Question