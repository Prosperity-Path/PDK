const data = require('./data.js') 

module.exports = {
    messages: data.messages,
    users: data.users,
    ingress: require('./ingress.js'),
    tests: require('./test.js')
}
