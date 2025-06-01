const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "PT_LOGS",
    {
      ID_LOG: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      TABLA: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      IDENTIFICADOR: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ACCION: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      DATO_ANTERIOR: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      DATO_POSTERIOR: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ID_USUARIO: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "PT_USUARIO",
          key: "ID_USUARIO",
        },
      },
      COMENTARIO: {
        type: DataTypes.STRING(150),
        allowNull: true,
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
      tableName: "PT_LOGS",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_PT_LOGS",
          unique: true,
          fields: [{ name: "ID_LOG" }],
        },
      ],
    }
  );
};
