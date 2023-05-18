const axios = require('axios')
const utils = require('./utils.js')  

const env = utils.envConfig()
const host = `http://localhost:${env.PORT}`

/* For these tests, our goal is to simply utilize all the
 * standard endpoints in a realistic sequence. So, first we
 * hit first-message, reply to first-message, then new message, 
 * followed by a reply, and finally- a scheduled message.
 */

const mockInitialMail = {
    'Message-Id': '<CAH8yDf6h5h7HQ_vx4e@mail.gmail.com>',
    'recipient': `${env.APP_ADDRESS}@${env.MAIL_DOMAIN}`,
    'sender': 'sam@wpmc.fund',
    'stripped-text': 'Hi- hows this werkk?',
    'subject': 'trying this out'
}

let mockInitialReply = mockInitialMail
mockInitialReply['In-Reply-To'] = '<CAH8yDf6h5h7HQ_vx4e@mail.gmail.com>' 
mockInitialReply['stripped-text'] = 'Uncertainty, Sadness' 
mockInitialReply['subject'] = 'Re: trying this out' 

const runTests = async () => {
    const response  = await axios.post(host + '/ingress', mockInitialMail)
    console.log(response.data)

    const replyRes  = await axios.post(host + '/ingress', mockInitialReply)
    console.log(replyRes)
}

runTests()
