
import { logger } from "../middlewares/log.midleware.js";


export class ApplicationError extends Error{
    constructor(message, code) {
        super(message)
        this.code = code
    }
};

export const appendFileLevelError = ((err, req, res, next) => {
    logger.error({
        "request URL": req.originalUrl,
        "request Method": req.method,
        "error message": err.message || "Unknown Error",
    });


    if (err instanceof ApplicationError) {
        return res.status(err.code).send(err.message)
    }
    res.status(500).send(`Oops! Something went wrong... Please try again later!`)
    console.log(err.message)
});
