const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "PT_TIPO_CASO",
    {
      ID_TIPO_CASO: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      NOMBRE: {
        type: DataTypes.STRING(150),
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
      tableName: "PT_TIPO_CASO",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_PT_TIPO_CASO",
          unique: true,
          fields: [{ name: "ID_TIPO_CASO" }],
        },
      ],
    }
  );
};
