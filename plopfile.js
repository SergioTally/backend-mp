module.exports = function (plop) {
  plop.setGenerator('module', {
    description: 'Genera controlador, ruta y servicio para un módulo',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Nombre del módulo (ej: caso):'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/controllers/{{camelCase name}}.controller.js',
        templateFile: 'plop-templates/controller.hbs'
      },
      {
        type: 'add',
        path: 'src/routes/{{camelCase name}}.routes.js',
        templateFile: 'plop-templates/route.hbs'
      },
      {
        type: 'add',
        path: 'src/services/{{camelCase name}}.service.js',
        templateFile: 'plop-templates/service.hbs'
      }
    ]
  });
};
