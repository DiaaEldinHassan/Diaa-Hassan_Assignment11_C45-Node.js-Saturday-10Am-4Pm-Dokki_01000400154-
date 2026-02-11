export function throwError(statusCode=500,message)
{
    const error=new Error(message);
    error.statusCode=statusCode;
    throw error;
}

export function duplicateError(statusCode=400,message="Sorry this data is signed before")
{
    const error=new Error(message);
    error.statusCode=statusCode;
    throw error;
}