import mongoosePkg from 'mongoose';
import config from "../../config/index.js";
import handleValidationError from "../../error/handleValidationError.js";
import handleCastError from "../../error/handleCastError.js";
import ApiError from "../../error/ApiError.js";
import handleMulterError from "../../error/handleMulterError.js";
import createErrorMessage from "../../utils/createErrorMessage.js";
import pkg from 'jsonwebtoken';
import { MulterError } from "multer";
import { errorLogger } from "../../utils/logger.js";

const { JsonWebTokenError, TokenExpiredError } = pkg;
const {  mongooseError } = mongoosePkg;

const globalErrorHandler = (error, req, res, next) => {
  const logError = config.env === "development" ? console.log : console.error;
  logError("❌ globalErrorHandler", error);
  errorLogger.error(error.message);

  // Default values
  let statusCode = error?.statusCode || 500;
  let message = error?.message || "Something went wrong!";
  let errorMessages = createErrorMessage(message);

  // Error type handlers
  const errorHandlers = {
    ValidationError: () => {
      const {
        statusCode: code,
        message,
        errorMessages: messages,
      } = handleValidationError(error);
      return { statusCode: code || 400, message, errorMessages: messages };
    },
    JsonWebTokenError: () => ({
      statusCode: 401,
      message: "Invalid token",
      errorMessages: createErrorMessage(error.message),
    }),
    TokenExpiredError: () => ({
      statusCode: 401,
      message: "Token has expired",
      errorMessages: createErrorMessage(error.message),
    }),
    CastError: () => {
      const {
        statusCode: code,
        message,
        errorMessages: messages,
      } = handleCastError(error);
      return { statusCode: code || 400, message, errorMessages: messages };
    },
    ApiError: () => ({
      statusCode: error?.statusCode || 500,
      message: error.message,
      errorMessages: createErrorMessage(error.message),
    }),
    DuplicateKeyError: () => {
      const field = Object.keys(error.keyValue)[0];
      return {
        statusCode: 409,
        message: `${field} must be unique`,
        errorMessages: createErrorMessage(`${field} must be unique`, field),
      };
    },
    TypeError: () => ({
      statusCode: 400,
      message: error.message,
      errorMessages: createErrorMessage(error.message),
    }),
    mongooseError: () => ({
      statusCode: 500,
      message: error.message,
      errorMessages: createErrorMessage(error.message),
    }),
    MulterError: () => handleMulterError(error),
  };

  // Determine the specific error handler
  const errorType =
    (error && errorHandlers[error.name]) ||
    (error instanceof JsonWebTokenError && errorHandlers.JsonWebTokenError) ||
    (error instanceof TokenExpiredError && errorHandlers.TokenExpiredError) ||
    (error instanceof ApiError && errorHandlers.ApiError) ||
    (error.code === 11000 && errorHandlers.DuplicateKeyError) ||
    (error instanceof TypeError && errorHandlers.TypeError) ||
    (error instanceof mongooseError && errorHandlers.mongooseError) ||
    (error instanceof MulterError && errorHandlers.MulterError);

  if (errorType) {
    ({ statusCode, message, errorMessages } = errorType());
  }

  // Ensure valid HTTP status code
  if (!Number.isInteger(statusCode) || statusCode < 100 || statusCode > 599) {
    statusCode = 500;
  }

  // Response
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== "production" ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
