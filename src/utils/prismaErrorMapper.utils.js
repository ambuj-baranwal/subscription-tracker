import { ApiError } from "./ApiError.js";
import { Prisma } from "@prisma/client";

export const handlePrismaError = (error) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return new ApiError(
          409,
          `Duplicate value for ${error.meta?.target?.join(", ")}`
        );

      case "P2025":
        return new ApiError(404, "Resource not found");

      case "P2003":
        return new ApiError(400, "Invalid reference");

      default:
        return new ApiError(500, "Database error");
    }
  }

  return error;
};
