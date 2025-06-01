const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "PT_FISCAL",
    {
      ID_FISCAL: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      ID_PERSONA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PT_PERSONA",
          key: "ID_PERSONA",
        },
      },
      ID_FISCALIA: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "PT_FISCALIA",
          key: "ID_FISCALIA",
        },
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
      tableName: "PT_FISCAL",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_PT_FISCAL",
          unique: true,
          fields: [{ name: "ID_FISCAL" }],
        },
      ],
    }
  );
};
