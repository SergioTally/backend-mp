const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "PT_CASO",
    {
      ID_CASO: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      ID_FISCAL: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "PT_FISCAL",
          key: "ID_FISCAL",
        },
      },
      CORRELATIVO: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      NOMBRE: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      OBSERVACION: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ACTIVO: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      ID_ESTADO_CASO: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "PT_ESTADO_CASO",
          key: "ID_ESTADO_CASO",
        },
      },
      ID_TIPO_CASO: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "PT_TIPO_CASO",
          key: "ID_TIPO_CASO",
        },
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
      tableName: "PT_CASO",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_PT_CASO",
          unique: true,
          fields: [{ name: "ID_CASO" }],
        },
      ],
    }
  );
};
