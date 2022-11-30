import express from 'express'
import { fork } from "child_process"
export const apiRouter = express.Router()

apiRouter.get('/randoms', (req, res)=> {
    let cantidad = parseInt(req.query.cantidad);
    if (isNaN(cantidad)) cantidad = 100000000
    let randoms = fork('randoms')
    randoms.on('message', message=> {
        if (message == 'listo') {
            randoms.send({cantidad})
        }
        else {
            console.log('Proceso hijo terminado')
            res.render('randoms', {randoms: message.result})
        }
    })

})