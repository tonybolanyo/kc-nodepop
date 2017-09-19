var swaggerJSDoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: {
        info: {
            title: 'Nodepop',
            version: '1.0.0',
            description: 'KeepCoding Web3 Node module'
        },
        produces: ['application/json'],
        consumes: ['application/json'],
        host: 'localhost:3000',
        basePath: '/apiv1/'
    },
    apis: [
        'routes/*.js'
    ]
});

module.exports = swaggerSpec