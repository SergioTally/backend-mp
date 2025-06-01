const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "PT_PERSONA",
    {
      ID_PERSONA: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      PRIMER_NOMBRE: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      SEGUNDO_NOMBRE: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      TERCER_NOMBRE: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      PRIMER_APELLIDO: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      SEGUNDO_APELLIDO: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      APELLIDO_CASADA: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      DIRECCION: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      NUMERO: {
        type: DataTypes.STRING(11),
        allowNull: true,
      },
      DPI: {
        type: DataTypes.STRING(13),
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
      tableName: "PT_PERSONA",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_PT_PERSONA",
          unique: true,
          fields: [{ name: "ID_PERSONA" }],
        },
      ],
    }
  );
};
