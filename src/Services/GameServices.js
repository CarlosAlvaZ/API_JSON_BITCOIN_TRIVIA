import Game from "../Models/GameModel.js";

export const GameService = {
    getOne : id => {
        try {
            return Game.find({ id : id })
        } catch (error) {
            return error
        }
    },
    store : newGame => {
        try {
            return Game.create(newGame)
        } catch (error) {
            return error
        }
    },
    updateState : (id, newState) => {
        try {
            return Game.findOneAndUpdate({ id : id }, { payState : newState }, { new : true })
        } catch (error) {
            return error
        }
    }
} 