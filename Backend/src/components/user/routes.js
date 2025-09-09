const router = require('express').Router()
const controller = require('./controller')
const response = require('../../network/response')
const { verifyToken } = require('../../middlewares/authHandlers')
const { changePasswordValidator } = require('./validators')

router.get('/', verifyToken, async (req, res, next) => {
    const { _id } = req.user
    try{
        const user = await controller.getUser(_id)
        response.success(req, res, user)
    }catch(error){
        next(error)
    }
})

router.post('/changePassword', verifyToken, changePasswordValidator, async (req, res, next) => {
    try{
        await controller.changePassword(req.user._id, req.body)
        response.success(req, res, {message: 'Password updated successfully'})
    }catch(err){
        next(err)
    }
})

module.exports = router