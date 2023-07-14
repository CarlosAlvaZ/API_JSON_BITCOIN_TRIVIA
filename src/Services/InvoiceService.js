import Invoice from "../Models/InvoiceModel.js";

export const InvoiceService = {
    getStatus : hash => {
        try {
            return Invoice.find( { hash : hash } )
        } catch (error) {
            return error
        }
    },
    createInvoice : newInvoice => {
        try {
            return Invoice.create(newInvoice)
        } catch (error) {
            return error
        }
    },
    updateStatus : (hash, newState) => {
        try {
            return Invoice.findOneAndUpdate({hash : hash}, {payed : newState}, {new : true})
        } catch (error) {
            return error
        }
    }
}