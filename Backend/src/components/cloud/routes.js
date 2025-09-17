const router = require('express').Router()
const controller = require('./controller')
const response = require('../../network/response')
const { verifyToken } = require('../../middlewares/authHandlers')
const { uploadFileValidator, newPathValidator, nameValidator, pathValidator } = require('./validators')

// DETAIL
router.get('/openDir/:path(*)?', verifyToken, (req, res, next) => {
    const path = req.params.path || ''
    response.process(req, res, next, controller.openDir, req.user._id, path)
})

router.get('/detailFile/:path(*)', verifyToken, pathValidator, async(req, res, next) => {
    const path = req.params.path || ''
    response.process(req, res, next, controller.detailFile, req.user._id, path)
})

router.get('/analytics', verifyToken, async(req, res, next) => {
    response.process(req, res, next, controller.analitycsData, req.user._id)
})

// UPLOAD & DOWLOAD
router.post('/createDir/:path(*)?', verifyToken, nameValidator, async(req, res, next) => {
    const path = req.params.path || ''
    response.process(req, res, next, controller.createDir, req.user._id, path, req.body.name)
})

router.post('/uploadFile/:path(*)?', verifyToken, uploadFileValidator, async(req, res, next) => {
    const path = req.params.path || ''
    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files]
    response.process(req, res, next, controller.uploadFile, req.user._id, path, files)
})

router.get('/downloadFile/:path(*)', verifyToken, pathValidator, async (req, res, next) => {
    try{
        const path = req.params.path || ''
        const { file, pathComplete } = await controller.downloadFile(req.user._id, path)
        res.setHeader('Content-disposition', `attachment; filename=${file}`);
        res.download(pathComplete)
    }catch(error){
        next(error)
    }
})

// ACTIONS
router.delete('/delete/:path(*)', verifyToken, pathValidator, async(req, res, next) => {
    const path = req.params.path || ''
    response.process(req, res, next, controller.deleteFile, req.user._id, path)
})

router.post('/copy/:path(*)', verifyToken, pathValidator, newPathValidator, async(req, res, next) => {
    const path = req.params.path || ''
    response.process(req, res, next, controller.copy, req.user._id, path, req.body.newPath, req.body.isFile)
})

router.post('/move/:path(*)', verifyToken, pathValidator, newPathValidator, async(req, res, next) => {
    const path = req.params.path || ''
    response.process(req, res, next, controller.move, req.user._id, path, req.body.newPath, req.body.isFile, req.body?.reemplazar)
})

router.post('/rename/:path(*)', verifyToken, pathValidator, nameValidator, async(req, res, next) => {
    const path = req.params.path || ''
    response.process(req, res, next, controller.rename, req.user._id, path, req.body.name)
})

router.get('/all/files', verifyToken, async(req, res, next) => {
    response.process(req, res, next, controller.allInfo, req.user._id, true)
})

router.get('/all/folders', verifyToken, async(req, res, next) => {
    response.process(req, res, next, controller.allInfo, req.user._id, false)
})


module.exports = router