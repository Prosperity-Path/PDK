const rxdb = require('rxdb')
const rxMemStore = require('rxdb/plugins/storage-memory')
const rxFoundationStore = require('rxdb/plugins/storage-foundationdb')
const msgUtils = require('./messaging.js')  



const setupDB = async (app) => {
    const prod = app.NODE_ENV == "production" 
    const rxEngine = prod ? rxFoundationStore.getRxStorageFoundationDB({apiVersion: 620}) : rxMemStore.getRxStorageMemory()
    app.db = await rxdb.createRxDatabase({
        name: 'kitdb',
        storage: rxEngine
    })
    app.db.addCollections({
        messages: {schema: msgUtils.messageSchema},
        unsubscribed: {schema: msgUtils.unsubscribeSchema}
    })
}

module.exports = {
    setupDB
}
