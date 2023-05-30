const axios = require('axios')
const msgUtils = require('../utils/messaging.js')  

const ingressRoute =  async (req, res) => {
    //We get a single POST request for all incoming mail routed to 
    //the APP_ADDRESS, so the ingress route provides the logic for 
    //routing and packaging a req to the APP_TARGET

    const app = req.app
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

    const response  = await axios.post(app.APP_TARGET + routeName, message)
        .catch(err => {
            response = {data: 'Unable to process.'}
            console.error(err)}
        )

    const sentMsg = await msgUtils.sendMail(app, message, response.data)
    // Store the message if it gets successfully sent
    if (sentMsg) {
        await app.db.messages.insert(sentMsg)
        .catch(err => {console.error(err)})
    }

    //let the ingress POST know that we received OK
    res.status(200).send(sentMsg)
}

module.exports = ingressRoute
