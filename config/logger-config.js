const pino = require('pino');

module.exports = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    bindings: (bindings) => {
      return { pid: bindings.pid };
    },
    level: (label) => {
      return { level: label.toUpperCase() };
    }
  }
});
