// src/middleware/errorHandler.js
const multer = require('multer');

function notFound(req, res) {
  res.status(404).json({ message: 'Njia haipatikani (Not found).' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Hitilafu ya kupakia faili: ${err.message}` });
  }

  console.error('[error]', err.message);
  if (process.env.NODE_ENV !== 'production') console.error(err.stack);

  const status = err.status || 500;
  const message =
    status === 500 ? 'Hitilafu ya ndani ya seva. Jaribu tena baadaye.' : err.message;

  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
