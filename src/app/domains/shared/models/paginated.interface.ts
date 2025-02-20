export interface Pagination<T> {
    data:  T[];
    meta:  Meta;
    links: Links;
}

export interface Links {
    first:    string;
    previous: string;
    current:  string;
    next:     string;
    last:     string;
}

export interface Meta {
    itemsPerPage: number;
    totalItems:   number;
    currentPage:  number;
    totalPages:   number;
    sortBy:       Array<string[]>;
}

export const DefaultPaginationValue: Pagination<any> = {
    data: [],
    meta: { totalItems: 0, itemsPerPage: 10, totalPages: 1, currentPage: 1, sortBy: [[]] },
    links: { first: '', previous: '', next: '', last: '', current: '' }
};