export default function errorHandler(error){
    const validationErrors = error.details.map((detail) => {
        return {
            field: detail.context.key,
            message: detail.message,
        };
    });
    
    const errorMessage = `${validationErrors
        .map((error) => `${error.message}`)
        .join(', \n')}`;
        
    throw errorMessage;
}