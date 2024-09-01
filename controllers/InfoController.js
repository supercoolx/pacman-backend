const moment = require('moment-timezone');

module.exports.getRemainingTime = (_, res) => {
    const now = moment().tz("America/New_York"); // Current time
    let nextExecution = moment().startOf('day').add(2, 'days'); // Start with the next 00:00 AM

    if (now.isAfter(nextExecution)) {
        nextExecution = nextExecution.add(2, 'days'); // If we missed the last execution, move to the next
    }

    const duration = moment.duration(nextExecution.diff(now));

    return res.status(200).send({
        days: Math.floor(duration.asDays()),
        hours: Math.floor(duration.asHours()) % 24,
        minutes: Math.floor(duration.asMinutes()) % 60,
        seconds: Math.floor(duration.asSeconds()) % 60,
    });
}