import { AppError, errorHandler } from "./error-handler";
import capitalizedRole from "./capitalized-role";
import dbConfig from "./db";
import FormValidator from "./form-validator";
import { generateOTP, generateSecureOTP } from "./generate-otp";
import BaseUrl from "./base-url";
import { getCurrentDateFormatted, getFormattedDate } from "./get-date";
import getModelByRole from "./get-model-by-role";
import hashPassword from "./hash-password";

export * from "./constants";
export {
  AppError,
  capitalizedRole,
  dbConfig,
  errorHandler,
  FormValidator,
  generateOTP,
  generateSecureOTP,
  BaseUrl,
  getCurrentDateFormatted,
  getFormattedDate,
  getModelByRole,
  hashPassword,
};
