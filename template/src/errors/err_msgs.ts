export enum ErrorTypes {
    user = 'UserError',
    database = 'DatabaseError'
}

export const errorMessages: Record<number, string> = {
    100: 'Missing RabbitMQ Connection',
    1001: 'Example Error'
};
