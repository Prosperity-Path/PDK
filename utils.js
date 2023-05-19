const validate = require('jsonschema').validate;

const messageSchema = {
    title: 'message schema',
    version: 0,
    primaryKey: 'messageId',
    type: 'object',
    properties: {
        messageId: {type: 'string', maxLength: 200},
        inReplyTo: {type: 'string'}, 
        sender: {type: 'string'},
        recipient: {type: 'string'},
        subject: {type: 'string'},
        message: {type: 'string'},
        HTMLmessage: {type: 'string'},
        date: {type: 'string'},
        messageHeaders: {type: 'string'},
    },
    required: [
        'messageId',
        'message',
        'sender',
        'recipient'
    ]
}

const queryParamsToSelector = (queryParams, schema) => {
    // Map the query params to props from msg schema
    let selectorObj = {}
    const props = Object.keys(schema.properties)
    Object.keys(queryParams).forEach(param => {
        selectorObj[param] = queryParams[param]
    })
    return {selector: selectorObj}
}

const mgMsgToMessage = (mgMsg, mgId) => {
    /* mgMsg is the core Mailgun message object which includes
     * {from, to, subject, text}
     * mgId is the id from the sent message response by Mailgun
     * This function takes those inputs and converts to Message
     * */
    const msgMap = {
        'messageId': mgId,
        'sender': mgMsg['from'],
        'recipient': mgMsg['to'],
        'message': mgMsg['text'],
        'subject': mgMsg['subject'],
        'date': (new Date).toUTCString()
    }
    validate(msgMap, messageSchema)
    return msgMap
}

const mailToMessage = (mail) => {
    const mailMsgMap = {
        'messageId': mail['Message-Id'],
        'sender': mail['sender'],
        'recipient': mail['recipient'],
        'message': mail['stripped-text'],
        'inReplyTo': mail['In-Reply-To'],
        'subject': mail['subject'],
        'date': mail['Date'],
        'HTMLmessage': mail['stripped-html'],
        'messageHeaders': mail['message-headers']
    }
    validate(mailMsgMap, messageSchema)
    return mailMsgMap
}

const envConfig = () => {
    let envConfig = {}
    requiredEnvVars = [
        {
            key: 'MAILGUN_API_KEY', 
            description: 'Private API key from mailgun panel'
        },
        {
            key: 'PORT', 
            description: 'PORT for node process to listen on e.g. 3000'
        },
        {
            key: 'MAIL_DOMAIN', 
            description: 'Domain configured in Mailgun for sending and receing email e.g. mail.riseofwizards.com'
        },
        {
            key: 'APP_TARGET', 
            description: 'URL for the app utilizing the PDK. e.g. myemailapp.riseofwizards.com or localhost:8000'
        },
        {
            key: 'APP_ADDRESS', 
            description: 'The unique portion of the email address used to identify the app. e.g. peace.pal in peace.pal@mail.example.app'
        }
    ]
    //This should be quick enough of an operation where
    //we don't need a synthetic sync block with await
    requiredEnvVars.forEach((ev) => {
        const val = process.env[ev.key]
        if ( val ) {
            envConfig[ev.key] = val
        } else {
            console.error(
                `Missing ${ev.key}. ${ev.description}.
                Please include and restart.`
            )
            process.exit()
        }
    })
    return envConfig
}

module.exports = { 
    messageSchema, 
    mailToMessage, 
    queryParamsToSelector,
    mgMsgToMessage,
    envConfig 
}
