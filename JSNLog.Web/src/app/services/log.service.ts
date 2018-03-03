import { Injectable, Inject } from '@angular/core';
import { JL } from 'jsnlog';

@Injectable()
export class LogService {
    baseUrl = '';
    isLogEnabled = false;
    constructor(@Inject('JSNLOG') private logger: JL.JSNLog) { }

    public init(baseUrl: string, logLevel: string = 'ALL', isLogEnabled: boolean = true) {
        this.baseUrl = baseUrl;
        this.isLogEnabled = isLogEnabled;

        if (!this.isLogEnabled) {
            return;
        }

        const logLevelInt = this.getLogLevel(logLevel);
        const ajaxAppender = JL.createAjaxAppender('example appender');
        ajaxAppender.setOptions({
            'level': logLevelInt,
            'url': `${this.baseUrl}/jsnlog.logger`,
            // Store up to 20 non-important messages before sending.
            'bufferSize': 20,
            // Buffer up to 20 info or lower messages before sending to server.
            'storeInBufferLevel': this.getLogLevel('INFO'),
            // Send immediately if error or fatal message.
            'sendWithBufferLevel': this.getLogLevel('ERROR'),
            // Try sending logs in 10 seconds interval.
            'sendTimeout': 10000
        });

        // Configure the JSNLog logging library.
        // See http://jsnlog.com/Documentation/JSNLogJs
        JL().setOptions({
            'appenders': [ajaxAppender],
            'level': logLevelInt
        });

        // Reconfigure global events.
        window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
            // Send object with all data to server side log, using severity fatal,
            // from logger "onerrorLogger"
            JL('onerrorLogger').fatalException({
                'msg': 'Uncaught Exception',
                'errorMsg': errorMsg, 'url': url,
                'line number': lineNumber, 'column': column
            }, errorObj);
            // Tell browser to run its own error handler as well
            return false;
        };

        if (typeof window !== 'undefined' && !(<any>window).onunhandledrejection) {
            (<any>window).onunhandledrejection = function (event) {
                // Send object with all data to server side log, using severity fatal,
                // from logger "onerrorLogger"
                JL('onerrorLogger').fatalException({
                    'msg': 'unhandledrejection',
                    'errorMsg': event.reason ? event.reason.message : null
                }, event.reason);
            };
        }
    }

    public trace(message: string | any) {
        // The `console.trace()` doesn't exist in NodeJS.
        const debug = console.trace || console.log;
        debug(message);

        if (this.isLogEnabled) {
            this.logger().trace(message);
        }
    }

    public debug(message: string | any) {
        // The `console.debug()` doesn't exist in NodeJS.
        const debug = console.debug || console.log;
        debug(message);

        if (this.isLogEnabled) {
            this.logger().debug(message);
        }
    }

    public info(message: string | any) {
        console.log(message);

        if (this.isLogEnabled) {
            this.logger().info(message);
        }
    }

    public warn(message: string | any) {
        console.warn(message);

        if (this.isLogEnabled) {
            this.logger().warn(message);
        }
    }

    public error(message: string | any, exception: any = null) {
        console.error(message, exception);

        if (this.isLogEnabled) {
            this.logger().error({
                message: message,
                exception: this.safeStringify(exception)
            });
        }
    }

    public fatal(message: string | any, exception: any = null) {
        console.error(message, exception);

        if (this.isLogEnabled) {
            this.logger().fatalException(message, this.safeStringify(exception));
        }
    }

    // Identical to fatal with exception that it will not output the error in the console.
    // The ErrorHandler should rethrow the exception which will display the error in the console.
    public logUnhandledException(message: string | any, exception: any = null) {
        if (this.isLogEnabled) {
            this.logger().fatalException(message, this.safeStringify(exception));
        }
    }

    // Some of the exceptions reported by Angular have circular references and cannot be serialized by JSON.stringify().
    private safeStringify(obj: any) {
        let cache = [];
        const result = JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference. Ignore it.
                    return;
                }

                cache.push(value);
            }

            return value;
        });

        // Clean up garbage collector.
        cache = null;
        return result;
    }

    // JSNLog is using numbers for log level.
    private getLogLevel(logLevel: string) {
        if (!!!logLevel) {
            logLevel = 'OFF';
        }

        switch (logLevel.toUpperCase()) {
            case 'ALL':
                return JL.getAllLevel();
            case 'FATAL':
                return JL.getFatalLevel();
            case 'ERROR':
                return JL.getErrorLevel();
            case 'INFO':
            case 'INFORMATION':
                return JL.getInfoLevel();
            case 'DEBUG':
                return JL.getDebugLevel();
            case 'TRACE':
            case 'VERBOSE':
                return JL.getTraceLevel();
        }

        return JL.getOffLevel();
    }
}
