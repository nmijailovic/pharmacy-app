const envFile = '/.env';

require('dotenv').config({
  path: __dirname + envFile
}); // read configuration from .env file

export default envFile;
