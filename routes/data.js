const msgUtils = require('../utils/messaging.js')  
const appUtils = require('../utils/application.js')  

const messages = async (req, res) => {
    const app = req.app
    const query = appUtils.queryParamsToSelector(
        req.query,
        msgUtils.messageSchema
    )
    results = await app.db.messages.find(query).exec()
    res.send(results)
}

module.exports = {
    messages
}
