//
// EXPRESS ENTRY POINT
//

// read configuration from .env file
import env from './env.js';
import app from './app';

// this line MUST be present here at the top as otherwise compiler 'optimisies' it away
console.log('----\n==> Reading environment vars from', __dirname + env);

if (process.env.API_PORT) {
  app.listen(process.env.API_PORT, err => {
    if (err) {
      console.error(err);
    }

    console.info('==> 🌎  API is running on port %s', process.env.API_PORT);
    console.info('==> 💻  Send requests to http://%s:%s', process.env.API_HOST, process.env.API_PORT);
  });
} else {
  console.error('==> ERROR: No PORT environment variable has been specified');
}
