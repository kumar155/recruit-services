const pino = require('pino');
const childProcess = require('child_process');

// module.exports = pino({
//   level: process.env.PINO_LOG_LEVEL || 'info',
//   timestamp: pino.stdTimeFunctions.isoTime,
//   formatters: {
//     bindings: (bindings) => {
//       return { pid: bindings.pid };
//     },
//     level: (label) => {
//       return { level: label.toUpperCase() };
//     }
//   }
// });

const stream = require('stream')

// Environment variables
const cwd = process.cwd()
const { env } = process
const logPath = `${cwd}/log`;

// Create a stream where the logs will be written
const logThrough = new stream.PassThrough()
const logger = pino({ name: 'project' }, logThrough)

// Log to multiple files using a separate process
const child = childProcess.spawn(process.execPath, [
  require.resolve('pino-tee'),
  'warn', `${logPath}/warn.log`,
  'error', `${logPath}/error.log`,
  'fatal', `${logPath}/fatal.log`,
  'info', `${logPath}/info.log`
], { cwd, env, stdio: ['pipe', 'inherit', 'inherit'] })

logThrough.pipe(child.stdin);

module.exports = logger;
