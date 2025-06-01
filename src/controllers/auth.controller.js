const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models");

// Modelos
const Usuario = db.PT_USUARIO;
const Role = db.PT_ROLE;
const Relacion = db.PT_ROLE_PERMISO_USUARIO;

exports.login = async (req, res) => {
  const { nombre, password } = req.body;

  try {
    const usuario = await Usuario.findOne({
      where: {
        USERNAME: nombre,
        ACTIVO: true,
      },
      attributes: ["ID_USUARIO", "USERNAME", "PASSWORD"],
    });

    if (!usuario) {
      return res.status(401).json({ error: "Usuario o contraseña inválidos" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.PASSWORD);
    if (!passwordValido) {
      return res.status(401).json({ error: "Usuario o contraseña inválidos" });
    }

    const relacion = await Relacion.findOne({
      where: { ID_USUARIO: usuario.ID_USUARIO },
      include: [
        {
          model: Role,
          as: "ROL",
          attributes: ["NOMBRE"],
          where: { ACTIVO: true },
        },
      ],
    });

    const rol = relacion?.ROL?.NOMBRE || "Desconocido";

    const token = jwt.sign(
      {
        id: usuario.ID_USUARIO,
        nombre: usuario.USERNAME,
        rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.register = async (req, res) => {
  const { nombre, password, idRol } = req.body;

  try {
    // Validar existencia de usuario
    const existe = await Usuario.findOne({ where: { USERNAME: nombre } });
    if (existe) return res.status(400).json({ error: "El usuario ya existe" });
    const hash = await bcrypt.hash(password, 10);

    const nuevo = await Usuario.create({
      USERNAME: nombre,
      PASSWORD: hash,
      ACTIVO: true,
    });

    if (idRol) {
      await Relacion.create({
        ID_USUARIO: nuevo.ID_USUARIO,
        ID_ROLE: idRol,
        ID_PERMISO: null,
      });
    }

    res.status(201).json({
      id: nuevo.ID_USUARIO,
      nombre: nuevo.USERNAME,
      rol: idRol ? "Asignado" : "No asignado",
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};
