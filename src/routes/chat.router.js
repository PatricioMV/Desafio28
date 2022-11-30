import express from 'express'
export const chatRouter = express.Router()

import { ChatManager } from '../controllers/chat.manager.js'
import { optionsSQLite } from '../options/sqlite3.config.js'
const manager = new ChatManager(optionsSQLite, 'chat')

chatRouter.get('/', (req, res) => {
    manager.findAll().then(result => res.send(result))
})

chatRouter.post('/', (req, res) => {
    if (!req.body.email || !req.body.message) return res.send({error: 'data is required'})
    manager.create(req.body).then(result => res.send(result))
})

