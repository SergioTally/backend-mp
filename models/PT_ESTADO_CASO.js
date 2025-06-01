const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "PT_ESTADO_CASO",
    {
      ID_ESTADO_CASO: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      NOMBRE: {
        type: DataTypes.STRING(50),
        allowNull: false,
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
      tableName: "PT_ESTADO_CASO",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_PT_ESTADO_CASO",
          unique: true,
          fields: [{ name: "ID_ESTADO_CASO" }],
        },
      ],
    }
  );
};
