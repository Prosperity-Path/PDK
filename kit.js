const express = require('express')
const axios = require('axios')
const appUtils = require('./utils/application.js')  
const msgUtils = require('./utils/messaging.js')  
const bodyParser = require('body-parser')
const rxdb = require('rxdb')
const rxMemStore = require('rxdb/plugins/storage-memory')
const formData = require('form-data');
const Mailgun = require('mailgun.js');

//Ensures we have the requird env vars and if not
//exit the process and report the missing var(s)
const env = appUtils.envConfig()

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api', 
    key: env.MAILGUN_API_KEY 
});

const app = express()
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true
}))

//TODO: STOP route/logic

//TODO: VALIDATE body.to is a email
const scheduleRoute = app.post('/schedule', async (req, res) => {
    try {
        const msg = req.body.msg
        const scheduleString = req.body.dateTime
        //const newDate = new Date(Date.parse(proposedDateTime))
        //const scheduleString = newDate.toUTCString()
        const sentMsg = await msgUtils.mailgunSend(
            mg, msg, msg.message, scheduleString
        )
        //let the ingress POST know that we received OK
        res.status(200).send(sentMsg)
    } catch (error) {
        res.send(error)    
    }
})

const dataRoute = app.get('/messages', async (req, res) => {
    //TODO: Add params outside of schema like pagination and limit
    const query = appUtils.queryParamsToSelector(
        req.query,
        msgUtils.messageSchema
    )
    results = await app.db.messages.find(query).exec()
    res.send(results)
})

const ingressRoute = app.post('/ingress', async (req, res) => {
    //We get a single POST request for all incoming mail routed to 
    //the APP_ADDRESS, so the ingress route provides the logic for 
    //routing and packaging a req to the APP_TARGET
    
    const message = msgUtils.mailToMessage(req.body)
    let replyResult, routeName
    if( message.inReplyTo ){
        routeName = '/reply'
        //We need to look up the message that's being replied to
        const replyQuery = {selector: {messageId: message.inReplyTo}}
        replyResult = await app.db.messages.findOne(replyQuery).exec()
    } else {
        //We need to check whether this is the first time we're 
        //getting a msg from the sender
        const senderQuery = {selector: {sender: message['sender']}}
        const result = await app.db.messages.findOne(senderQuery).exec()
        if (result && result._data) {
            routeName = '/new-message'
        } else {
            routeName = '/first-message'
        }
    }

    await app.db.messages.insert(message)
    .catch(err => {console.error(err)})
    //We don't need the text content of the message we're replying
    // to in the DB again, but it's useful to POST to the app
    if(replyResult){
        message.replyingTo = replyResult._data.message
    }

    const response  = await axios.post(env.APP_TARGET + routeName, message)
    .catch(err => {console.error(err)})

    const sentMsg = await msgUtils.mailgunSend(mg, message, response.data)
    // Store the message if it gets successfully sent
    if (sentMsg) {
        await app.db.messages.insert(sentMsg)
        .catch(err => {console.error(err)})
    }

    if(routeName == '/first-message'){
        //Start scheduling sequence on first message
        const response  = await axios.post(env.APP_TARGET + '/scheduled', message)
    .catch(err => {console.error(err)})
    }

    //let the ingress POST know that we received OK
    res.status(200).send(sentMsg)
})

const routePromises = [ingressRoute, dataRoute, scheduleRoute]

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
    axios.defaults.headers.post['PDK-URL'] = `http://127.0.0.1:${env.PORT}`
    app.listen(env.PORT, () => {
        console.log(`Starting the prosperity dev kit @ localhost:${env.PORT}`)
    })
})
