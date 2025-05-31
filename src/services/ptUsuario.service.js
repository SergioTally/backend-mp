const db = require("../../models");
const PtUsuario = db.PtUsuario;

exports.getAll = async () => {
  return await PtUsuario.findAll();
};

exports.getById = async (id) => {
  return await PtUsuario.findByPk(id);
};

exports.create = async (data) => {
  return await PtUsuario.create(data);
};

exports.update = async (id, data) => {
  const item = await PtUsuario.findByPk(id);
  if (!item) return null;
  return await item.update(data);
};

exports.remove = async (id) => {
  const item = await PtUsuario.findByPk(id);
  if (!item) return null;
  await item.destroy();
  return item;
};
