import { GameService } from '../Services/GameServices.js'
import { InvoiceService } from '../Services/InvoiceService.js'
import checksum from 'checksum'

export const GameController = {
    getStatus : async (req, res) => {
        const { id } = req.params
        const game = await GameService.getOne(id)
        const invoices = game[0].invoices
        const [ invoice1, invoice2 ] = invoices
        const invoice1status = await InvoiceService.getStatus(invoice1)
        const invoice2status = await InvoiceService.getStatus(invoice2)
        return res.status(200).json({
            status : 200,
            data : [invoice1status, invoice2status]
        })
    },
    createGame : async (req, res) => {

        const id = checksum(Date.now().toString())

        const invoice1 = { hash : '12345' }
        // const invoice1 = https://api.lnbits/createinvoices/100
        const invoice2 = { hash : '12345' }
        // const invoice2 = https://api.lnbits/createinvoices/100
        
        const createdInvoice1 = await InvoiceService.createInvoice(invoice1)
        const createdInvoice2 = await InvoiceService.createInvoice(invoice2)


        const newGame = {
            id : id,
            invoices : [createdInvoice1.hash, createdInvoice2.hash]
        }

        const createdGame = await GameService.store(newGame)
        
        return res.status(200).json({
            status : 200,
            data : createdGame
        })
    },
    updateGameStatus : async (req, res) => {
        const { id } = req.params

        const game = await GameService.getOne(id)
        const state = game[0].payState
        
        let newInvoice1State = false
        let newInvoice2State = false

        
        if (state[0] === false || state[1] === false) {
            newInvoice1State = true
            newInvoice2State = true
            const newState = await GameService.updateState(id, [newInvoice1State, newInvoice2State])
            
            const [ invoice1, invoice2 ] = game[0].invoices
            await InvoiceService.updateStatus(invoice1, newInvoice1State)
            await InvoiceService.updateStatus(invoice2, newInvoice2State)
            return res.status(200).json({
                satus : 200,
                data : newState
            })
        } else {
            return res.status(200).json({
                status : 200,
                data : true
            })
        }
    }
}
