import express from 'express'
export const infoRouter = express.Router()

infoRouter.get('/', (req, res) => {
    res.render('info', { argumentoDeEntrada : process.argv.slice(2), plataforma: process.platform, versionNode: process.version, memoria: process.memoryUsage().rss, path: process.execPath, processId: process.pid, capetaDelProyecto: process.cwd() })
})