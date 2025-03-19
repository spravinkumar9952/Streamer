import fs from "fs";
import path from "path";
import util from "util";

// Log file path
const logFilePath = path.join(__dirname, "app.log");

// Create a writable stream
const logStream = fs.createWriteStream(logFilePath, { flags: "a" }); // 'a' for append

// Helper function to format logs
const logToFile = (level: string, message: any) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}]: ${util.format(message)}\n`;
    logStream.write(formattedMessage);
};

// Override console methods
console.log = (...args) => logToFile("log", args);
console.info = (...args) => logToFile("info", args);
console.warn = (...args) => logToFile("warn", args);
console.error = (...args) => logToFile("error", args);

// Capture uncaught exceptions & rejections
process.on("uncaughtException", (err) => {
    logToFile("EXCEPTION", err.stack || err);
    process.exit(1); // Exit to avoid undefined behavior
});

process.on("unhandledRejection", (reason, promise) => {
    logToFile("REJECTION", `Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

export default logToFile;
