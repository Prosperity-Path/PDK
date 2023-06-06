const utils = require('../utils')  

const messages = async (req, res) => {
    const app = req.app
    const query = utils.app.queryParamsToSelector(
        req.query,
        utils.msg.messageSchema
    )
    results = await app.db.messages.find(query).exec()
    res.send(results)
}

const users = async (req, res) => {
    const app = req.app
    let results = []
    results = await app.db.messages.find(
        {selector: {sender: 
            {$ne: `${app.APP_ADDRESS}@${app.MAIL_DOMAIN}`}
        }}
    ).exec()
    if(results?.length > 0) {
        results = [...new Set(results.map(r => r.sender))]
    }
    res.send(results)
}

module.exports = {
    messages,
    users
}
