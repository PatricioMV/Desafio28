import express from 'express';
export const productosRouter = express.Router();
import { options } from '../options/mysql.config.js';

import { Manager } from '../controllers/manager.js';
const manager = new Manager(options, 'productos')

productosRouter.get('/', (req, res) => {
    manager.findAll().then(result => res.send(result));
})

productosRouter.get('/:id', (req, res) => {
    manager.findById(req.params.id).then(result => res.send(result));
})

productosRouter.post('/', (req, res) => {
    if (!req.body.title || !req.body.price || !req.body.thumbnail) return res.send({error: "Falta informacion"});
    manager.create(req.body).then(result=> res.send(result))
    })

productosRouter.put('/:id', (req, res) => {
    if (!req.body.title || !req.body.price || !req.body.thumbnail) return res.send({error: "Falta informacion"});
    let result = manager.update(req.params.id, req.body);
    if (!result) return res.send({error: "Producto no encontrado"});
    res.send(result);
})

productosRouter.delete('/:id', (req, res) => {
    manager.delete(req.params.id).then(result => res.send(result));
})

