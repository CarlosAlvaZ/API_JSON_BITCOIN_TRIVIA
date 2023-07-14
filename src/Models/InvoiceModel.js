import mongoose, {Schema, model} from "mongoose";

const InvoiceSchema = new Schema({
    hash : {
        type : String
    },
    payed : {
        type : Boolean,
        default : false
    }
}, { collection : "Invoices" } )

const Invoice = model('Invoice', InvoiceSchema)

export default Invoice