// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');

const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimit');

const app = express();

// Behind a reverse proxy (nginx/Render/Railway) in production so we get the
// real client IP for rate limiting and audit logs.
app.set('trust proxy', 1);

// ── Security headers ──
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'same-site' },
  })
);

// ── CORS: only the configured frontend origin(s) may call this API,
//    and credentials (cookies) are allowed only for those origins. ──
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || env.ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error('Haijaruhusiwa na CORS (Not allowed by CORS).'));
    },
    credentials: true,
  })
);

app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', apiLimiter);

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
