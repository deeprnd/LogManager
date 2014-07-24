(function () {
    'use strict';
    var logger,
        m = require('moment'),
        getCurrentTime = function getCurrentTime() {
            return m().utc().format('HH:mm:ss.SSS');
        };

    // creates new log
    // id - appends id to every log for tracing
    // keepLocalCopy, true - keeps local copy of logs
    function LogManager(id, keepLocalCopy) {
        this.id = id;
        this.keepLocalCopy = keepLocalCopy;
        if (keepLocalCopy) {
            this.localCopy = [];
        }
    }

    // writes info log
    LogManager.prototype.info = function info(message, obj) {
        var log;
        if (obj) {
            log = {d: this.id, t: getCurrentTime(), i: message, o: obj};
        } else {
            log = {d: this.id, t: getCurrentTime(), i: message};
        }
        logger.info(log);
        if (this.keepLocalCopy) {
            this.localCopy.push(log);
        }
    };

    // writes error log
    // message - message of error
    // obj - object associated with error (maybe Exception class)
    // e - exception
    LogManager.prototype.error = function info(message, obj, e) {
        var log;
        if (obj) {
            if (obj instanceof Error) {
                log = {d: this.id, t: getCurrentTime(), e: message, x: obj.message, s: obj.stack};
            } else if (e) {
                if (e instanceof  Error) {
                    log = {d: this.id, t: getCurrentTime(), e: message, o: obj, x: e.message, s: e.stack};
                } else {
                    log = {d: this.id, t: getCurrentTime(), e: message, o: obj, x: e, s: new Error().stack};
                }
            } else {
                log = {d: this.id, t: getCurrentTime(), e: message, o: obj, s: new Error().stack};
            }
        } else {
            log = {d: this.id, t: getCurrentTime(), e: message, s: new Error().stack};
        }

        logger.error(log);
        if (this.keepLocalCopy) {
            this.localCopy.push(log);
        }
    };

    /*
    Marks start of operation and returns the marker
     */
    LogManager.prototype.start = function start(name) {
        return {timeStamp: new Date(), name: name};
    };

    /*
    Ends operation and marks time spent according to the received marker
     */
    LogManager.prototype.end = function end(start) {
        var log = {d: this.id, t: getCurrentTime(), i: 'delta of (' + start.name + '): ' + (new Date() - start.timeStamp) + ' ms'};

        logger.info(log);
        if (this.keepLocalCopy) {
            this.localCopy.push(log);
        }
    };

    /*
    Initiates LogManager with received settings
     */
    LogManager.init = function init(settings) {
        if (!logger) {
            logger = require('winston')
            if (settings.IS_LOGGLY) {
                var LOGGLY;
                require('winston-loggly');
                LOGGLY = settings.LOGGLY;
                logger.add(logger.transports.Loggly, {
                    subdomain: LOGGLY.SUBDOMAIN,
                    inputToken: LOGGLY.INPUT_TOKEN,
                    tags: ["NodeJS"],
                    json: true,
                    auth: {
                        username: LOGGLY.USERNAME,
                        password: LOGGLY.PASSWORD
                    }
                });
            } else if (settings.IS_FILE) {
                logger.add(logger.transports.File, { filename: settings.FILE_NAME });
            }
        }
    }

    /*
    Returns a new instance of LogManager
     */
    LogManager.getInstance = function getInstance(keepLocalCopy) {
        return new LogManager(require('node-uuid').v4(), keepLocalCopy);
    };

    module.exports = LogManager;
}());