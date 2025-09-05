export type User = {
    id?: number;
    name?: string;
    email?: string;
};
export type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
};
//# sourceMappingURL=types.d.ts.map