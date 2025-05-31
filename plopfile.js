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
        path: 'controllers/{{camelCase name}}Controller.js',
        templateFile: 'plop-templates/controller.hbs'
      },
      {
        type: 'add',
        path: 'routes/{{camelCase name}}Routes.js',
        templateFile: 'plop-templates/route.hbs'
      },
      {
        type: 'add',
        path: 'services/{{camelCase name}}Service.js',
        templateFile: 'plop-templates/service.hbs'
      }
    ]
  });
};
