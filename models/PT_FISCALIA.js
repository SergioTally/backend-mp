const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "PT_FISCALIA",
    {
      ID_FISCALIA: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      NOMBRE: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      DIRECCION: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      NUMERO: {
        type: DataTypes.STRING(11),
        allowNull: true,
      },
      ACTIVO: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      FECHA_REGISTRO: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.fn("getdate"),
      },
      FECHA_ELIMINO: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "PT_FISCALIA",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_PT_FISCALIA",
          unique: true,
          fields: [{ name: "ID_FISCALIA" }],
        },
      ],
    }
  );
};
