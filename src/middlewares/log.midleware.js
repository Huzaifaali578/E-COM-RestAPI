import fs from "fs";
import winston from "winston";

// Custom timestamp format
const customTimestamp = winston.format((info) => {
    info.timestamp = new Date().toString();
    return info;
});


export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        customTimestamp(),
        winston.format.json()
    ),
    // defaultMeta: { service: 'request-logging' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'log.txt' , level: 'info'})
    ]
});


const loggerMiddleware = async (req, res, next) => {
    // Log request body as a string
    const logData = `${req.url} - ${JSON.stringify(req.body)}`;
    logger.info(logData)
    next();
};

export default loggerMiddleware;
