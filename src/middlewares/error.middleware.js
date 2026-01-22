import {ApiError} from "../utils/ApiError.js";
import {handlePrismaError} from "../utils/prismaErrorMapper.utils.js";

const errorMiddleware = (err, req, res, next) => {
  let error = handlePrismaError(err);
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    statusCode: error.statusCode,
  };

  if (process.env.NODE_ENV === "development") { response.stack = error.stack }

  return res.status(error.statusCode).json(response);
};

export { errorMiddleware };
