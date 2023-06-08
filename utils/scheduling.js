var parser = require('cron-parser');

const processCronStr = (cronString, interval) => {
    const schedule = parser.parseExpression(cronString);
    const scheduleDate = new Date(schedule.next().toString())
    const currentDT = (new Date()).getTime()
    const scheduleDiff = (scheduleDate.getTime() - currentDT)/1000
    return (scheduleDiff > 0 && scheduleDiff < interval)
}

module.exports = {
    processCronStr
}
