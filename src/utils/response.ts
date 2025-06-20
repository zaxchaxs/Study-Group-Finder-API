export const successResponse = (data: any, message?: string) => {
    return {
        code: 200,
        statusMessage: 'success',
        data,
        message
    }
};

export const errorResponse = (code: number, statusMessage: string, error: any, message: string) => {
    return {
        code,
        statusMessage,
        error,
        message
    }
}