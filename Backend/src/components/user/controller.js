const myError = require('../../libs/myError')
const bcrypt = require('bcrypt')
const Model = require('./model')
const Store = require('../../db/store')
const store = new Store(Model)
const cloudController = require('../cloud/controller')

async function getUser(id){
    const analytics = await cloudController.analitycsData(id)
    const user = await store.findOneById(id, {password: 0})
    user._doc.analytics = analytics

    return user
}

async function changePassword(userId, passwords){
    const { actual, newPassword } = passwords
    const user = await store.findOneById(userId)

    if(!user) throw myError("User doesn't exist", 400)
    
    const { password } = user
    
    const isMatch = await bcrypt.compare(actual, password)
    if(!isMatch){
        throw myError('The current password is incorrect', 400)
    }

    const updateObj = { 
        password: await bcrypt.hash(newPassword, 10) 
    }

    return store.updateOne(userId, updateObj)
}

module.exports = {
    getUser,
    changePassword
}