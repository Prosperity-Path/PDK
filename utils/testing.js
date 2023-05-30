
const mockInitialMail = (app, trigger) => {
    return {
        'Message-Id': '<CAH8yDf6h5h7HQ_vx4e@mail.gmail.com>',
        'recipient': `${app.APP_ADDRESS}@${app.MAIL_DOMAIN}`,
        'sender': 'email@example.com',
        'stripped-text': trigger.testInput,
        'subject': 'trying this out'
    }
}

const mockInitialReply = (app, trigger) => {
    return {
        'Message-Id' : '<AAL8yDf6h5h7HQ_vx4e@mail.gmail.com>',
        'recipient': `${app.APP_ADDRESS}@${app.MAIL_DOMAIN}`,
        'sender': 'email@example.com',
        'In-Reply-To' : '<CAH8yDf6h5h7HQ_vx4e@mail.gmail.com>',
        'stripped-text' : trigger.testInput,
        'subject' : 'Re: trying this out' 
    }
}

let mockNewMail = (app, trigger) => {
    return {
        'Message-Id' : '<SDE8yDf6h5h7HQ_vx4e@mail.gmail.com>',
        'recipient': `${app.APP_ADDRESS}@${app.MAIL_DOMAIN}`,
        'sender': 'email@example.com',
        'stripped-text' : trigger.testInput,
        'subject' : 'New thought' 
    }
}

const scheduledMail = (app, trigger) => {
    return {
        'Message-Id': '<ACTWP8yDf6h5h7HQ_vx4e@mail.gmail.com>',
        'recipient': `${app.APP_ADDRESS}@${app.MAIL_DOMAIN}`,
        'sender': `${app.APP_ADDRESS}@${app.MAIL_DOMAIN}`,
        'stripped-text': trigger.testInput,
        'subject': 'Scheduled Send'
    }
}

const testTriggerMap = (app, trigger) => {
    const funcMap = {
        "first-message": mockInitialMail,
        "reply": mockInitialReply,
        "new-message": mockNewMail,
        "schedule": scheduledMail
    }[trigger]
    return funcMap(app, trigger) 
}

module.exports = {testTriggerMap}
