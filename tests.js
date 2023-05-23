const axios = require('axios')
const appUtils = require('./utils/application.js')  
const triggers = require('./triggers.json')

const env = appUtils.envConfig()
const host = `http://localhost:${env.PORT}`

/* For these tests, our goal is to simply utilize all the
 * standard endpoints in a realistic sequence. 
 * Think of them more as simple end to end tests. So, first we
 * hit first-message, reply to first-message, then new message, 
 * followed by a reply, and finally- a scheduled message.
 */

const firstTrigger = triggers.find(t => t.trigger == 'first-message')
const mockInitialMail = {
    'Message-Id': '<CAH8yDf6h5h7HQ_vx4e@mail.gmail.com>',
    'recipient': `${env.APP_ADDRESS}@${env.MAIL_DOMAIN}`,
    'sender': 'sam@wpmc.fund',
    'stripped-text': firstTrigger.testInput,
    'subject': 'trying this out'
}

const replyTrigger = triggers.find(t => t.trigger == 'reply')
const mockInitialReply = {
    'Message-Id' : '<AAL8yDf6h5h7HQ_vx4e@mail.gmail.com>',
    'recipient': `${env.APP_ADDRESS}@${env.MAIL_DOMAIN}`,
    'sender': 'sam@wpmc.fund',
    'In-Reply-To' : '<CAH8yDf6h5h7HQ_vx4e@mail.gmail.com>',
    'stripped-text' : replyTrigger.testInput,
    'subject' : 'Re: trying this out' 
}

const newTrigger = triggers.find(t => t.trigger == 'new-message')
let mockNewMail = {
    'Message-Id' : '<SDE8yDf6h5h7HQ_vx4e@mail.gmail.com>',
    'recipient': `${env.APP_ADDRESS}@${env.MAIL_DOMAIN}`,
    'sender': 'sam@wpmc.fund',
    'stripped-text' : newTrigger.testInput,
    'subject' : 'New thought' 
}

const scheduledMail = {
    'Message-Id': '<ACTWP8yDf6h5h7HQ_vx4e@mail.gmail.com>',
    'recipient': `${env.APP_ADDRESS}@${env.MAIL_DOMAIN}`,
    'sender': `${env.APP_ADDRESS}@${env.MAIL_DOMAIN}`,
    'stripped-text': 'sam@wpmc.fund',
    'subject': 'Scheduled Send'
}

const runCoreTests = async () => {
    const firstMailResponse = await axios.post(host + '/ingress', mockInitialMail)
    console.log('First mail response: ', firstMailResponse.data)

    const replyResponse = await axios.post(host + '/ingress', mockInitialReply)
    console.log('Reply mail response: ', replyResponse.data)

    const newMailResponse = await axios.post(host + '/ingress', mockNewMail)
    console.log('New mail response: ', newMailResponse.data)
}

const runScheduleTests = async () => {
    const currentDateTime = new Date();
    //increment DateTime by 30min
    const incrementedDT = new Date(currentDateTime.getTime() + 5*60000).toUTCString()
    const scheduleResponse = await axios.post(host + '/schedule', {'dateTime': incrementedDT, 'to': 'sam@wpmc.fund'})
    console.log('schedule response: ', scheduleResponse.data)

    const scheduledResponse = await axios.post(host + '/ingress', scheduledMail)
    console.log('scheduled response: ', scheduledResponse.data)
}

runCoreTests()
runScheduleTests()
