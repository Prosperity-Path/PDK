const axios = require('axios')
const utils = require('../utils')  
const ingress = require('./ingress.js')  

const testRoute = async (req, res) => {
    const app = req.app
    const notFound = "Unable to GET triggers from app"
    const testTriggers = app.TEST_TRIGGERS
    if(!testTriggers) {
        res.status(422).send(notFound)
    } else {
        const routeToTest = req.params?.route
        const routeTrigger = testTriggers.find(t => t.trigger == routeToTest)
        req.body = utils.test.testTriggerMap(app, routeTrigger)
        if(routeToTest == 'schedule') {
            const response  = await axios.post(app.APP_TARGET + '/schedule', {})
            res.send(response.data)
        } else {
            ingress(req, res)
        }
    }
}

module.exports = testRoute
