import mongoose, {Schema, model} from "mongoose";

const InvoiceSchema = new Schema({
    bolt : {
        type : String
    },
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