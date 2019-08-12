/**
 * Sequelize Models represent a DB Table and its associations
 * http://docs.sequelizejs.com/manual/models-definition.html
 */
export default (sequelize, DataTypes) => {
  const Prescription = sequelize.define(
    // Sequelize column options - http://docs.sequelizejs.com/manual/models-definition.html
    // type - sequelize data type - http://docs.sequelizejs.com/variable/index.html#static-variable-DataTypes
    // primaryKey: true or false
    // autoIncrement: true or false
    // defaultValue: true OR defaultValue: Sequelize.NOW OR relevant default value for the type
    // allowNull: false or true
    // unique: 'compositeIndex' - set for multiple columns to form composite index OR true / false
    // field: 'field_with_underscores' - You can specify a custom column name via the 'field' attribute
    // It is possible to create foreign keys
    // comment: 'column comment' - it is possible to add coments on columns for MySQL, PostgreSQL and MSSQL
    // only validate: - it is possible to set per attribute validations

    'Prescription',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

        allowNull: true
        // unique: false / true
      },
      IssuingDoctorId: {
        type: DataTypes.INTEGER,

        allowNull: false
        // unique: false / true
      },
      IssuedToUserId: {
        type: DataTypes.INTEGER,

        allowNull: false
        // unique: false / true
      },
      ProvidedByDrugstoreId: {
        type: DataTypes.INTEGER,

        allowNull: true
        // unique: false / true
      },
      ProvidedAt: {
        type: DataTypes.DATE,

        allowNull: true
        // unique: false / true
      },
      DeliveredByCourierId: {
        type: DataTypes.INTEGER,

        allowNull: false
        // unique: false / true
      },
      DeliveredAt: {
        type: DataTypes.DATE,

        allowNull: true
        // unique: false / true
      },
      expiryDate: {
        type: DataTypes.DATEONLY,

        allowNull: true
        // unique: false / true
      },
      notes: {
        type: DataTypes.TEXT,

        allowNull: true
        // unique: false / true
      },
      createdAt: {
        type: DataTypes.DATE,

        allowNull: false
        // unique: false / true
      },
      deletedAt: {
        type: DataTypes.DATE,

        allowNull: true
        // unique: false / true
      },
      updatedAt: {
        type: DataTypes.DATE,

        allowNull: false
        // unique: false / true
      }
    },
    {
      // The name of the model. The model will be stored in `sequelize.models` under this name.
      // This defaults to class name i.e. Bar in this case. This will control name of auto-generated
      // foreignKey and association naming
      // modelName: 'Prescription',

      // false = don't add the timestamp attributes (updatedAt, createdAt)
      timestamps: true,

      // don't delete database entries but set the newly added attribute deletedAt
      // to the current date (when deletion was done). paranoid will only work if
      // timestamps are enabled
      paranoid: true,

      // Will automatically set field option for all attributes to snake cased name.
      // Does not override attribute with field option already defined
      // underscored: true,

      // disable the modification of table names; By default, sequelize will automatically
      // transform all passed model names (first parameter of define) into plural.
      // if you don't want that, set the following
      freezeTableName: false

      // define the table's name
      // tableName: 'Prescriptions'

      // Enable optimistic locking.  When enabled, sequelize will add a version count attribute
      // to the model and throw an OptimisticLockingError error when stale instances are saved.
      // Set to true or a string with the attribute name you want to use to enable.
      // version: true
    }
  );

  Prescription.associate = models => {
    // Used to describe associations
    // Read More at http://docs.sequelizejs.com/manual/associations.html
    models.Prescription.belongsTo(models.Doctor);
    models.Prescription.belongsTo(models.User);
    models.Prescription.belongsTo(models.Drugstore);
    models.Prescription.belongsTo(models.Courier);
    models.Prescription.hasMany(models.PrescriptionItem);
  };

  // Instance Methods

  // Prescription.prototype.someMethod = function(id1, id2) {
  //   return new Promise((resolve, reject) => {
  //     // Within Instance Methods, you can refer current instance via this.xyz field
  //     return sequelize.query('SQL QUERY', { type: sequelize.QueryTypes.SELECT })
  //     return sequelize.query('SQL QUERY', { type: sequelize.QueryTypes.BULKUPDATE })
  //     return sequelize.query('SQL QUERY', { type: sequelize.QueryTypes.UPDATE })
  //     return sequelize.query('SQL QUERY', { type: sequelize.QueryTypes.DELETE })
  //       .then(result => {
  //            return resolve(result);
  //       });
  //   }
  // }

  // Class Methods

  // Prescription.SomeClassMethod = function(id1, id2) {
  //   return new Promise((resolve, reject) => {
  //     return sequelize.query('SQL QUERY', { type: sequelize.QueryTypes.SELECT })
  //     return sequelize.query('SQL QUERY', { type: sequelize.QueryTypes.BULKUPDATE })
  //     return sequelize.query('SQL QUERY', { type: sequelize.QueryTypes.UPDATE })
  //     return sequelize.query('SQL QUERY', { type: sequelize.QueryTypes.DELETE })
  //       .then(result => {
  //            return resolve(result);
  //       });
  //   }
  // }

  return Prescription;
};
