import { format, createLogger, transports } from "winston";
import { Request, Response, NextFunction } from "express";
const { combine, timestamp, label, prettyPrint } = format;

export const logger = createLogger({
  level: "info",
  format: combine(
    label({ label: "error occurred" }),
    timestamp(),
    prettyPrint()
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

export const error = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  logger.log({
    level: "info",
    message: err.message,
  });
  logger.log({
    level: "error",
    message: err.message,
  });

  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new transports.Console({
        format: format.simple(),
      })
    );

    return res
      .status(500)
      .json({ message: err.message, error: true, stack: err.stack });
  }

  res.status(500).json({ message: err.message, error: true });
};
