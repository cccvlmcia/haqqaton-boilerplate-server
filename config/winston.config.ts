import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import path from "path";
import stream from "stream";
const {combine, timestamp, printf, colorize} = winston.format;

const logDir = "logs";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "info";
};

const logStream = (options?: any) =>
  new stream.Duplex({
    write: function (message: string) {
      console.info(message);
    },
  });
// Log Format
const logFormat = (filename: string) => {
  return combine(
    timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
    printf(info => {
      if (info.stack) {
        return `${info.timestamp} [${filename} ${info.level}] ${info.message} \n Error Stack: ${info.stack}`;
      }
      return `${info.timestamp} [${filename} ${info.level}] ${info.message}`;
    }),
  );
};

// 콘솔에 찍힐 때는 색깔을 구변해서 로깅해주자.
const consoleOpts = {
  handleExceptions: true,
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(colorize({all: true}), timestamp({format: "YYYY-MM-DD HH:mm:ss:ms"})),
};

const transports = function (name: string) {
  return [
    // 콘솔로그찍을 때만 색넣자.
    new winston.transports.Console(consoleOpts),
    // ws 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: path.join(logDir, `/${name}`),
      filename: `%DATE%.${name}.error.log`,
      maxSize: "50m",
      maxFiles: 30,
      zippedArchive: true,
    }),
    // 모든 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "debug",
      datePattern: "YYYY-MM-DD",
      dirname: path.join(logDir, `/${name}`),
      filename: `%DATE%.${name}.all.log`,
      maxSize: "50m",
      maxFiles: 7,
      zippedArchive: true,
    }),
  ];
};
winston.addColors(colors);

const apiLogger = winston.createLogger({
  level: level(),
  levels,
  format: logFormat("api"),
  transports: transports("api"),
});

apiLogger.stream = logStream;

const dbLogger = winston.createLogger({
  level: level(),
  levels,
  format: logFormat("db"),
  transports: transports("db"),
});

dbLogger.stream = logStream;

// uncaughtException
process.on("uncaughtException", function (err) {
  apiLogger.error("uncaughtException: " + err.stack);
});

export {apiLogger, dbLogger};
