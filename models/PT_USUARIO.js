const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const PT_USUARIO = sequelize.define(
    "PT_USUARIO",
    {
      ID_USUARIO: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      USERNAME: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      PASSWORD: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ID_PERSONA: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "PT_PERSONA",
          key: "ID_PERSONA",
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
      tableName: "PT_USUARIO",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_PT_USUARIO",
          unique: true,
          fields: [{ name: "ID_USUARIO" }],
        },
      ],
    }
  );

  PT_USUARIO.associate = (models) => {
    PT_USUARIO.hasMany(models.PT_ROLE_PERMISO_USUARIO, {
      foreignKey: "ID_USUARIO",
      as: "rolesAsignados",
    });
  };

  return PT_USUARIO;
};
