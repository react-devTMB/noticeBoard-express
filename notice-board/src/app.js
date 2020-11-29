import express from 'express';
import loaders from './loaders/index.js';
import config from './config/index.js';

(async function start() {
  const app = express();

  // init app
  await loaders({ expressApp: app });

  // listen app
  app.listen(config.port, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
  });
})();
