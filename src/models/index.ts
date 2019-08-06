import Sequelize from 'sequelize';

console.log('DB environment = ', process.env.NODE_ENV, process.env.DB_HOST, process.env.DB_NAME);
const env = process.env.NODE_ENV || 'development';

const config = {
  dialect: 'mysql',
  dialectOptions: { supportBigNumbers: true, bigNumberStrings: false },
  // dialectOptions: 'supportBigNumbers=true',
  host: process.env.DB_HOST,
  logging: process.env.SEQUELIZE_LOGGING === 'off' ? () => {
  } : console.log
};

// Below code will import the files into distribution
// https://gist.github.com/ihavenoidea14/0dab8b461c057c427829fdc99bfb6743
let models = {};

(function (config, force = false) {
  if (Object.keys(models).length && !force) {
    return models;
  }

  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, config);

  let modules = [
    require('./Couriers.ts'),
    require('./Doctors.ts'),
    require('./Drugstores.ts'),
    require('./Prescriptions.ts'),
    require('./PrescriptionItems.ts'),
    require('./Users.ts')
  ];

  // Initialize models
  modules.forEach(module => {
    const model = module.default(sequelize, Sequelize, config);
    models[model.name] = model;
  });

  // Apply associations
  Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
      models[key].associate(models);
    }
  });

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;

  return models;
})(config);

export default models;
