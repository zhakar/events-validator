export class Logger {
  static info(message) {
    const msg = `[INFO] ${new Date().toLocaleTimeString()} : ${message}`;
    console.log(msg);
  }

  static error(message) {
    const msg = `[ERROR] ${new Date().toLocaleTimeString()} : ${message}`;
    console.log(msg);
  }
};
