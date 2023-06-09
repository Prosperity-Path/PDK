const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const routes = require('./routes')
const utils = require('./utils')  

const app = express()
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true
}))

//TODO: STOP route/logic

const sendPromise = app.post('/send', async (req, res) => {
    const message = req.body
    const sent = await utils.msg.sendMail(app, message, message.message)
    await app.db.messages.insert(sent)
    res.send(sent)
})

const routePromises = [sendPromise,
    utils.app.envConfig(app),
    app.get('/messages', routes.messages),
    app.get('/users', routes.users),
    app.get('/tests/:route?', routes.tests),
    app.post('/ingress', routes.ingress)
]

Promise.all(routePromises).then(async (res) => {
    // Once we have the routes setup, we setup the DB
    // In dev, we use an in-memory data store, else FoundationDB
    await utils.db.setupDB(app)

    //TODO: Before deploying, will need to evaluate changing the 
    //host from localhost (127.0.0.1)
    axios.defaults.headers.post['PDK-URL'] = `http://127.0.0.1:${app.PORT}`
    app.listen(app.PORT, () => {
        console.log(`Starting the prosperity dev kit`)
    })
    setInterval(utils.app.testPoll,app.POLL_INTERVAL, app);
})
