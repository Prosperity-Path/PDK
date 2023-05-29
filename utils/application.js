const formData = require('form-data')
const Mailgun = require('mailgun.js')
const defaults = require('./defaults.js')
const axios = require('axios')

const queryParamsToSelector = (queryParams, schema) => {
    // Map the query params to props from msg schema
    let selectorObj = {}
    const props = Object.keys(schema.properties)
    Object.keys(queryParams).forEach(param => {
        selectorObj[param] = queryParams[param]
    })
    return {selector: selectorObj}
}

const envConfig = async (app) => {
    cmdCtrlUrl = process.env.CMD_CTRL_URL || defaults.CMD_CTRL
    const mgRes = await axios.get(
        `${cmdCtrlUrl}/mg-config`
    )
    const mgConfig = mgRes.data
    app.MAIL_DOMAIN = mgConfig.MAIL_DOMAIN || defaults.MAIL_DOMAIN
    const mailgun = new Mailgun(formData);
    try {
        app.mailer = mailgun.client({
            username: 'api', 
            key: mgConfig.MAILGUN_API_KEY 
        });
    } catch (error) {
        console.error(error)        
        process.exit()
    }

    app.APP_TARGET = process.env.APP_TARGET || defaults.APP_TARGET
    app.PORT = process.env.PORT || defaults.PORT

}

module.exports = { 
    queryParamsToSelector,
    envConfig 
}
