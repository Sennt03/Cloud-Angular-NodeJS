const router = require('express').Router()

const auth = require('../components/auth/routes')
const user = require('../components/user/routes')
const cloud = require('../components/cloud/routes')

function routerApp(app){
    app.use('/api', router)
    router.use('/auth', auth)
    router.use('/user', user)
    router.use('/cloud', cloud)
}

module.exports = routerApp