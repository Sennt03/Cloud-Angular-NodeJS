exports.success = (req, res, data, status = 200) => {
    res.status(status).send(data)
}

exports.process = async (req, res, next, controllerFunction, ...args) => {
    try {
        const result = await controllerFunction(...args);
        res.status(200).send(result)
    } catch (error) {
        next(error);
    }
}