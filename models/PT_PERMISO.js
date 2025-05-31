const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PT_PERMISO', {
    ID_PERMISO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NOMBRE: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    ACTIVO: {
      type: DataTypes.CHAR(10),
      allowNull: false
    },
    FECHA_REGISTRO: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    FECHA_ELIMINO: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'PT_PERMISO',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_PT_PERMISO",
        unique: true,
        fields: [
          { name: "ID_PERMISO" },
        ]
      },
    ]
  });
};
