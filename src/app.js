import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import mongoose from "mongoose"
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars';
import passport from 'passport'
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { productosRouter } from './routes/productos.router.js';
import { chatRouter } from './routes/chat.router.js';
import { apiRouter } from './routes/api.js'
import { infoRouter } from './routes/info.js';
import { Users } from './data/Users.js'
import { initializePassport } from './passport.config.js'

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(express.static('./src/public'));
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

let PORT = parseInt(process.argv.slice(2,3))
if(isNaN(PORT) || undefined) { PORT = 8080}

const server = app.listen(PORT, () => console.log("Servidor listo"));

mongoose.connect("mongodb://localhost:27017/desafio26", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'desafio26'
})

app.use(session({
    store: MongoStore.create({ 
        client: mongoose.connection.getClient(),
        dbName: 'desafio26',
        collectionName: 'sessions'
    }),
    key: 'user_sid',
    secret: 'c0d3r',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 },
    ttl: 3600
}))

initializePassport()
app.use(passport.initialize());
app.use(passport.session());

const io = new Server(server)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Cambios Desafio 26
const sessionChecker = (req, res, next) => {
    if (req.session.email && req.cookies.user_sid) {
        res.redirect('/dashboard')
    } else {
        next()
    }
}

app.route('/login').get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
}).post(passport.authenticate('login', { failureRedirect : '/failureRegister'}), (req, res) => {
        req.session.email = email
        res.redirect('/dashboard')
})

app.get('/register', sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/register.html')
})

app.post('/register', passport.authenticate('register', { failureRedirect : '/failureRegister'}),(req, res) => {
    console.log('entro en POST register')
    //res.redirect('/dashboard')
       // if (err) {
       //     res.redirect('/register')
       // } else {
       //     req.session.user = docs
       //     res.redirect('/dashboard')
       // }
})

app.get('/failureRegister', (req, res) => {
    res.send({err: ''})
})

app.get('/dashboard', (req, res) => {
    if (req.session.email && req.cookies.user_sid) {
        res.render('productos', { usuario : req.session.email })
    } else {
        res.redirect('/login')
    }
})

app.get('/logout', (req, res) => {
    if (req.session.email && req.cookies.user_sid) {
        res.clearCookie('user_sid')
        res.render('logOut', { usuario : req.session.email })
    } else {
        res.redirect('/login')
    }
})

// Cambios para producto

import knex from 'knex';
import { options } from './options/mysql.config.js';
import { Manager } from './controllers/manager.js';
let managerProductos = new Manager(options, 'productos');
const database = knex(options);


// cambios para chat

import { ChatManager } from './controllers/chat.manager.js'
import { optionsSQLite } from './options/sqlite3.config.js'
import yargs from 'yargs';
const manager = new ChatManager(optionsSQLite, 'chat')

app.use(express.json());
app.use('/productos', productosRouter);
app.use('/chat', chatRouter);
app.use('/info', infoRouter);
app.use('/api', apiRouter);

io.on('connection', socket => {
    console.log(`Cliente ${socket.id} se conecto`)
    managerProductos.findAll().then(result => io.emit('history', result))
    manager.findAll().then(result => socket.emit('chatHistory', result))
    socket.on('productos', data =>{
        managerProductos.findAll().then(result => io.emit('history', result))
    })
    socket.on('chat', data => {
        manager.findAll().then(result => io.emit('chatHistory', result))
    })
})

app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login')
    //res.render('productos')
})

app.use((req, res) => res.redirect('/login'))
