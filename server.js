(function () {
    'use strict';
    var express = require('express'), app = express(),
        nconf = require('nconf'), winston = require('winston'),
        i = 0, LogManager = require("./common/LogManager.js"),
		init = function init() {
			var path = require('path');
			nconf.file({
				file : path.resolve(__dirname,  'config.json')
			});

            LogManager.init(nconf.get("logger"), {
                transports: [
                    new (winston.transports.File)({
                        filename: 'common.log'
                    })
                ]
            });

            app.get('/', function (req, res) {
                var logger = LogManager.getInstance(), delta;
                logger.info('call number: ' + (i++));
                // do some logic
                logger.info('another log');
                delta = logger.start('some async method');
                setTimeout(function () {
                    logger.end(delta);
                    if (Math.random() > 0.2) {
                        logger.error('something bad happened');
                    }
                }, Math.round(Math.random() * 10000));
                res.end();
            });

            app.listen('3000', '127.0.0.1');
 		};
    init();
}());