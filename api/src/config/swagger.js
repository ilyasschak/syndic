import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition:{
        openapi : '3.0.0',
        info:{
            title : 'Authentication API',
            version : '1.0.0',
            description : 'API documentation for authentication API'
        },
    },
    apis : ['./src/routes/**.js']
};

export default swaggerJsdoc(options);