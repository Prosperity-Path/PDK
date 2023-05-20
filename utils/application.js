
const queryParamsToSelector = (queryParams, schema) => {
    // Map the query params to props from msg schema
    let selectorObj = {}
    const props = Object.keys(schema.properties)
    Object.keys(queryParams).forEach(param => {
        selectorObj[param] = queryParams[param]
    })
    return {selector: selectorObj}
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
    queryParamsToSelector,
    envConfig 
}
