export const successResponse = (data: any, message?: string) => {
    return {
        code: 200,
        statusCode: 'success',
        data,
        message
    }
};

export const errorResponse = (code: number, statusCode: string, error: any, message: string) => {
    return {
        code,
        statusCode,
        error,
        message
    }
}