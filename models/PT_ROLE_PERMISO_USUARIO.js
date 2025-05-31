module.exports = function (sequelize, DataTypes) {
  const PT_ROLE_PERMISO_USUARIO = sequelize.define(
    "PT_ROLE_PERMISO_USUARIO",
    {
      ID_ROLE: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
        references: {
          model: "PT_ROLE",
          key: "ID_ROLE",
        },
      },
      ID_PERMISO: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
        references: {
          model: "PT_PERMISO",
          key: "ID_PERMISO",
        },
      },
      ID_USUARIO: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
        references: {
          model: "PT_USUARIO",
          key: "ID_USUARIO",
        },
      },
    },
    {
      sequelize,
      tableName: "PT_ROLE_PERMISO_USUARIO",
      schema: "dbo",
      timestamps: false,
      noPrimaryKey: true,
      hasPrimaryKeys: false,
      omitNull: true,
    }
  );

  PT_ROLE_PERMISO_USUARIO.associate = (models) => {
    PT_ROLE_PERMISO_USUARIO.belongsTo(models.PT_USUARIO, {
      foreignKey: "ID_USUARIO",
      as: "usuario",
    });

    PT_ROLE_PERMISO_USUARIO.belongsTo(models.PT_ROLE, {
      foreignKey: "ID_ROLE",
      as: "ROL",
    });

    PT_ROLE_PERMISO_USUARIO.belongsTo(models.PT_PERMISO, {
      foreignKey: "ID_PERMISO",
      as: "permiso",
    });
  };

  return PT_ROLE_PERMISO_USUARIO;
};
