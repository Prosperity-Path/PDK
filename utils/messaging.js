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


module.exports = { 
    messageSchema, 
    mailToMessage, 
    mgMsgToMessage,
}
