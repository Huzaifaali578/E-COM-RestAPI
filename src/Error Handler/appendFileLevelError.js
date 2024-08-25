import { logger } from "../middlewares/log.midleware.js";
import { ApplicationError } from "./applicationError.js";

export const appendFileLevelError = (err, req, res, next) => {
    logger.error({
        "request URL": req.originalUrl,
        "request Method": req.method,
        "error message": err.message || "Unknown Error",
        "stack trace": err.stack || "No stack trace available", // Include stack trace for debugging
    });

    // Check if the error is an instance of ApplicationError
    if (err instanceof ApplicationError) {
        const statusCode = err.code && Number.isInteger(err.code) ? err.code : 500; // Validate the status code
        return res.status(statusCode).send({ error: err.message });
    }

    // For all other errors, default to 500
    res.status(500).send({ error: "Oops! Something went wrong... Please try again later!" });
    console.error(err); // Log the error to the console for debugging
};
