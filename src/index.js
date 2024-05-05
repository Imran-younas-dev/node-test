import path from 'path'
import lumie from 'lumie'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import rateLimit from 'express-rate-limit'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

import exceptionHander from './middlewares/exception-handler'
import { createClient } from './config/redis'
;(async function () {
    /**
     * load environment variables from .env
     */
    dotenv.config()

    /**
     * initiate the express server instance
     */
    const app = express()

    /**
     * initiate the sentry instance
     */
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // enable Express.js middleware tracing
            new Tracing.Integrations.Express({ app }),
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 0,
    })

    /**
     * The request handler must be the
     * first middleware on the app
     */
    app.use(Sentry.Handlers.requestHandler())

    /**
     * TracingHandler creates a trace
     * for every incoming request
     */
    app.use(Sentry.Handlers.tracingHandler())

    /**
     * enable cors for express app
     */
    const cors = require('cors')({
        origin: true,
    })
    app.use(cors)

    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message:
            'Too many requests from this IP, please try again after 15 minutes',
    })
    app.use('/api/', apiLimiter)

    /*
     * To access files placed in storage using url
     * */
    app.use('/storage', express.static('storage'))
    /**
     * parse the form data from body using body parser
     */
    app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    )

    /**
     * parse the json from body using body parser
     */
    app.use(
        bodyParser.json({
            limit: '100mb',
        })
    )

    /**
     * Bind routes with express app
     */
    lumie.load(app, {
        preURL: 'api',
        verbose: true,
        ignore: ['*.spec', '*.action', '*.md'],
        controllers_path: path.join(__dirname, 'controllers'),
    })

    /**
     * connect to the redis wait for the connection then proceed
     */
    await createClient()

    /**
     * The error handler must be before
     * any other error middleware and
     * after all controllers
     */
    app.use(Sentry.Handlers.errorHandler())

    /**
     * Default exception handing
     */
    app.use(exceptionHander)

    /**
     * get express port from .env
     * or declare with default value
     */
    const port = process.env.PORT || 3000

    const server = require('./config/socket')(app)
    /**
     * listen to the exposed port
     */
    server.listen(port, () => {
        // eslint-disable-next-line
        console.log('App server started on port ' + port)
    })
})()
