// src/server.js
const app = require('./app');
const env = require('./config/env');
require('./config/db'); // ensures schema is created on boot

app.listen(env.PORT, () => {
  console.log(`✔ PRP backend running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  console.log(`  Allowed frontend origins: ${env.ALLOWED_ORIGINS.join(', ')}`);
});
