const axios = require('axios')
const utils = require('./utils.js')  

const host = 'http://localhost:3000'

const mockInitialMail = {
    'Message-Id': '<CAH8yDf6h5h7HQ_vx4e@mail.gmail.com>',
    'recipient': 'peace.pal@mail.riseofwizards.com',
    'sender': 'sam@wpmc.fund',
    'stripped-text': 'Hi- hows this werkk?',
    'subject': 'trying this out'
}

const mockInitialReply = {
    'Message-Id': '<OPR8yDf6h5h7HQ_vx4e@mail.gmail.com>',
    'In-Reply-To': '<CAH8yDf6h5h7HQ_vx4e@mail.gmail.com>',
    'recipient': 'peace.pal@mail.riseofwizards.com',
    'sender': 'sam@wpmc.fund',
    'stripped-text': 'Uncertainty, Sadness',
    'subject': 'Re: trying this out'
}

const runTests = async () => {
    const response  = await axios.post(host + '/ingress', mockInitialMail)
    console.log(response.data)

    const replyRes  = await axios.post(host + '/ingress', mockInitialReply)
    console.log(replyRes)
}

runTests()
