const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const myError = require('../../libs/myError')
const config = require('../../config/config')
const Model = require('../user/model')
const Store = require('../../db/store')
const store = new Store(Model)
const cloudController = require('../cloud/controller')

async function register(user){
    const password = await bcrypt.hash(user.password, 10)
    user.password = password
    const newUser = await store.addOne(user)

    await cloudController.registerDir(newUser._id)
    
    const sendUser = await createSendUser(newUser)

    const token = jwt.sign(sendUser, config.jwtSecret, { expiresIn: '6h' })

    
    return { user: sendUser, token }
}

async function login({ email, password }){
    const user = await store.findOne({ email })
    
    if(!user){
        // throw myError('Unauthorized', 401)
        // throw myError('Invalid Credentials', 401)
        throw myError('User incorrect', 401)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        // throw myError('Invalid Credentials', 401)
        throw myError('Password incorrect', 401)
    }

    await cloudController.registerDir(user._id)

    const sendUser = await createSendUser(user)
    const token = jwt.sign(sendUser, config.jwtSecret, { expiresIn: '6h' })    
    

    return { user: sendUser, token }
}

async function createSendUser(user){
    const data = await cloudController.analitycsData(user._id)

    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        analytics: data
    }
}

function findValidate(field, email = true) {
  const regexField = new RegExp(`^${field}$`, 'i');
  const query = email ? { email: { $regex: regexField } } : { username: { $regex: regexField } };

  return store.findOne(query);
}

async function validateField(field, value){
    let exists
    if(field === 'email'){
        const re = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$")
        if(!re.exec(value)) return { isAvailable: true }
        exists = await findValidate(value)
    }
    // else if(field === 'username'){
    //     exists = await store.findValidate(value, false)
    // }
    else{
        throw myError('Field invalid', 400)
    }

    let isAvailable = exists ? false : true

    return {
        isAvailable
    }
}

module.exports = {
    register,
    login,
    validateField
}