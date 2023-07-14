import mongoose, {Schema, model} from "mongoose";

const GameSchema = new Schema ({
    id : {
        type : String,
        required : true
    },
    invoices : {
        type : Array,
        default : []
    },
    payState : {
        type : Array,
        default : [false, false]
    }
}, { collection : "Games"})

const Game = model('Game', GameSchema)

export default Game