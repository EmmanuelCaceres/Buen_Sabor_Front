
export interface IPaginatedResponse<T> {
    content: T[]; // El array de elementos (en este caso, de tipo IArticuloInsumo)
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
