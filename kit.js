const express = require('express')
const axios = require('axios')
const appUtils = require('./utils/application.js')  
const msgUtils = require('./utils/messaging.js')  
const dbUtils = require('./utils/db.js')  
const bodyParser = require('body-parser')
const ingressRoute = require('./routes/ingress.js')  
const testRoute = require('./routes/test.js')  
const dataRoute = require('./routes/data.js')  

const app = express()
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true
}))

//Ensures we have the requird env vars and if not
//exit the process and report the missing var(s)
appUtils.envConfig(app)

//TODO: STOP route/logic

const sendPromise = app.post('/send', async (req, res) => {
    const message = req.body
    const sent = await msgUtils.sendMail(app, message, message.message)
    res.send(sent)
})

const messagesRoute = app.get('/messages', dataRoute.messages)
const usersRoute = app.get('/users', dataRoute.users)
const testsPromise = app.get('/tests/:route?', testRoute)
const ingressPromise = app.post('/ingress', ingressRoute)

const routePromises = [ingressPromise, sendPromise, testsPromise, messagesRoute, usersRoute]

Promise.all(routePromises).then(async (res) => {
    // Once we have the routes setup, we setup the DB
    // In dev, we use an in-memory data store, else FoundationDB
    await dbUtils.setupDB(app)

    //TODO: Before deploying, will need to evaluate changing the 
    //host from localhost (127.0.0.1)
    axios.defaults.headers.post['PDK-URL'] = `http://127.0.0.1:${3000}`
    app.listen(3000, () => {
        console.log(`Starting the prosperity dev kit`)
    })
    setInterval(appUtils.appTestPoll, 30000, app);
})
