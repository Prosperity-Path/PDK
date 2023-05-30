const express = require('express')
const axios = require('axios')
const appUtils = require('./utils/application.js')  
const msgUtils = require('./utils/messaging.js')  
const bodyParser = require('body-parser')
const rxdb = require('rxdb')
const rxMemStore = require('rxdb/plugins/storage-memory')
const ingressRoute = require('./routes/ingress.js')  
const testRoute = require('./routes/test.js')  

const app = express()
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true
}))

//Ensures we have the requird env vars and if not
//exit the process and report the missing var(s)
appUtils.envConfig(app)

//TODO: STOP route/logic

const dataRoute = app.get('/messages', async (req, res) => {
    //TODO: Add params outside of schema like pagination and limit
    const query = appUtils.queryParamsToSelector(
        req.query,
        msgUtils.messageSchema
    )
    results = await app.db.messages.find(query).exec()
    res.send(results)
})

const testsPromise = app.get('/tests/:route?', testRoute)

const ingressPromise = app.post('/ingress', ingressRoute)

const routePromises = [ingressPromise, testsPromise, dataRoute]

Promise.all(routePromises).then(async (res) => {
    // Once we have the routes setup, we setup the DB
    // In dev, we use an in-memory data store, else FoundationDB
    // TODO: Configure foundation cluster for when deployed
    app.db = await rxdb.createRxDatabase({
        name: 'kitdb',
        storage: rxMemStore.getRxStorageMemory()
    })
    app.db.addCollections({
        messages: {schema: msgUtils.messageSchema}
    })

    //TODO: Before deploying, will need to evaluate changing the 
    //host from localhost (127.0.0.1)
    axios.defaults.headers.post['PDK-URL'] = `http://127.0.0.1:${3000}`
    app.listen(3000, () => {
        console.log(`Starting the prosperity dev kit`)
    })
    setInterval(appUtils.appTestPoll, 10000, app);
})
