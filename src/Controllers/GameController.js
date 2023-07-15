import { GameService } from '../Services/GameServices.js'
import { InvoiceService } from '../Services/InvoiceService.js'
import checksum from 'checksum'


let lnurlpass = {
    lnurllid: null,
  };
  
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

        const url = "https://0ec5-45-161-24-74.ngrok-free.app/api/v1/payments";

        let data = {
            "out": false, 
            "amount": 21, 
            "memo": "description", 
            "expiry": 0, 
            "unit": "sat", 
            "webhook": null, 
            "internal": false
        }

        let fetchData = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                "X-Api-Key": "b6d2f1b10887467cb227f5c44c34c234"
            }
        }
        
        const bolt1 = await fetch(url, fetchData).then(res => res.json()).catch(err => console.log(err))
        const bolt2 = await fetch(url, fetchData).then(res => res.json()).catch(err => console.log(err))

        const getPaymentHash1 = bolt1.payment_hash //Getting pay Hash
        const getPaymentHash2 = bolt2.payment_hash //Getting pay Hash

        console.log(bolt1.payment_request)
        console.log(bolt2.payment_request)
        const invoice1 = { bolt : bolt1.payment_request, hash : bolt1.payment_hash}
        const invoice2 = { bolt : bolt2.payment_request, hash : bolt2.payment_hash }
        // const invoice2 = https://api.lnbits/createinvoices/100

        console.log(invoice1)

        const createdInvoice1 = await InvoiceService.createInvoice(invoice1)
        const createdInvoice2 = await InvoiceService.createInvoice(invoice2)

        //////////////////////////////////////////////////s
    
    
        const newGame = {
            id : id,
            invoices : [{bolt: createdInvoice1.bolt, hash : createdInvoice1.hash}, {bolt : createdInvoice2.bolt, hash : createdInvoice2.hash}]
        }

        const createdGame = await GameService.store(newGame)
        async function getStat() {
            const urlPayStatus1 = `https://0ec5-45-161-24-74.ngrok-free.app/api/v1/payments/${getPaymentHash1}/`;
            const urlPayStatus2 = `https://0ec5-45-161-24-74.ngrok-free.app/api/v1/payments/${getPaymentHash2}/`;

        let fetchDataPayStatus = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                "X-Api-Key": "b6d2f1b10887467cb227f5c44c34c234"
            }
        }

        const payStatus1 = await fetch(urlPayStatus1, fetchDataPayStatus).then(res => res.json()).catch(err => console.log(err))
        const payStatus2 = await fetch(urlPayStatus2, fetchDataPayStatus).then(res => res.json()).catch(err => console.log(err))

        console.log("Estado actual 1: " + payStatus1.paid);
        console.log("Estado actual 2: " + payStatus2.paid);

        }
        getStat()
        return res.status(200).json({
            status : 200,
            data : createdGame
        })
    },
    updateGameStatus : async (req, res) => {
        try {

            const { id } = req.params

            const game = await GameService.getOne(id)
            const state = game[0].payState
            
            let newInvoice1State = false
            let newInvoice2State = false

            if (state[0] === false || state[1] === false) {
                const urlPayStatus1 = `https://0ec5-45-161-24-74.ngrok-free.app/api/v1/payments/${game[0].invoices[0].hash}`;
                const urlPayStatus2 = `https://0ec5-45-161-24-74.ngrok-free.app/api/v1/payments/${game[0].invoices[1].hash}`;

                let fetchDataPayStatus = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        "X-Api-Key": "b6d2f1b10887467cb227f5c44c34c234"
                    }
                }

                newInvoice1State = await fetch(urlPayStatus1, fetchDataPayStatus).then(res => res.json()).catch(err => console.log(err))
                newInvoice2State = await fetch(urlPayStatus2, fetchDataPayStatus).then(res => res.json()).catch(err => console.log(err))
                const newState = await GameService.updateState(id, [newInvoice1State.paid, newInvoice2State.paid])
                
                const [ invoice1, invoice2 ] = game[0].invoices
                await InvoiceService.updateStatus(invoice1.hash, newInvoice1State.paid)
                await InvoiceService.updateStatus(invoice2.hash, newInvoice2State.paid)
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

        } catch (error) {
            console.log(error)
        }
    },
    createLnurl: async (req, res) => {
        const urlLnurl = "https://0ec5-45-161-24-74.ngrok-free.app/withdraw/api/v1/links";
      
        let data = {
          "title": "random",
          "min_withdrawable": 35,
          "max_withdrawable": 35,
          "uses": 1,
          "wait_time": 1,
          "is_unique": false,
          "webhook_url": null
        }
      
        let fetchDataLnurl = {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            "X-Api-Key": "b6d2f1b10887467cb227f5c44c34c234"
          }
        }
      
        const createLnurlWithDraw = await fetch(urlLnurl, fetchDataLnurl).then(res => res.json()).catch(err => console.log(err))
      
        console.log("Id lnurl widthdraw: " + createLnurlWithDraw);
      
        const lnurl = createLnurlWithDraw.lnurl;
      
        return res.status(200).json({
          status: 200,
          data: lnurl
        })
      },      
      updateLnurlStatus: async (req, res) => {
    
        const { lnurl } = req.params.lnurl
      
        const lurlPayStatus = `https://0ec5-45-161-24-74.ngrok-free.app/v1/links/${lnurl}}/`;
      
        let fetchDataPayStatusLnurl = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            "X-Api-Key": "b6d2f1b10887467cb227f5c44c34c234"
          }
        }
      
        const lnurlwpayStatus1 = await fetch(lurlPayStatus, fetchDataPayStatusLnurl).then(res => res.json()).catch(err => console.log(err))
      
        console.log("Estado actual 1: " + lnurlwpayStatus1.used);
      
        return res.status(200).json({
          status: 200,
          data: "payed"
        })
      }
}