const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const router = require('./network/routes')
const errHandler = require('./middlewares/errorHandlers')
const config = require('./config/config')
const db = require('./db/connection')
const path = require('path')

const optionsCors = { origin: (origin, callback) => {
    if (config.whiteList.includes(origin) || !origin) callback(null, true);
        else callback(new Error('no permitido'));
    }
}

class App{

    constructor(){
        this.app = express()
        db()
        this.middlewares()
        this.routes()
        this.errHandlers()
    }

    middlewares(){
        // this.app.use(cors(optionsCors));
        this.app.use(cors());
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: true}))
        this.app.use(fileUpload())
    }

    routes(){
        router(this.app)

        this.app.use(express.static(path.join(__dirname, '/uploads/docs')))
        this.app.use(express.static(path.join(__dirname, '../public/browser')))

        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/browser/index.html'))
        })
    }

    errHandlers(){
        // this.app.use(errHandler.logErrors)
        this.app.use(errHandler.errorHandler)
    }

    start(){
        this.app.listen(config.port, () => {
        // this.app.listen(config.port, '192.168.100.75', () => {
            console.log('Server on port', config.port)
        })
    }

}

module.exports = App