(function () {
    'use strict';
    var express = require('express'), app = express(), nconf = require('nconf'),
        LogManager = require("./common/LogManager.js"),
		init = function init() {
			var path = require('path');
			nconf.file({
				file : path.resolve(__dirname,  'config.json')
			});

            LogManager.init(nconf.get("logger"));


            app.get('/', function (req, res) {
                var logger = LogManager.getInstance();

                logger.info('inside the get');
                // do some logic
                logger.info('another log');
                res.end();
            });

            app.listen('3000', '127.0.0.1');
 		};
    init();
}());