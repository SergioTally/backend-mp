const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const PT_ROLE = sequelize.define(
    "PT_ROLE",
    {
      ID_ROLE: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      NOMBRE: {
        type: DataTypes.STRING(100),
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
      tableName: "PT_ROLE",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_PT_ROLE",
          unique: true,
          fields: [{ name: "ID_ROLE" }],
        },
      ],
    }
  );

  PT_ROLE.associate = (models) => {
    PT_ROLE.hasMany(models.PT_ROLE_PERMISO_USUARIO, {
      foreignKey: "ID_ROLE",
      as: "permisosRol",
    });
  };
  return PT_ROLE;
};
