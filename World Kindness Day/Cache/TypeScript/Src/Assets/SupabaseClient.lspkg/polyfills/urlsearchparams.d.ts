export declare class URLSearchParams {
    private _params;
    constructor(init?: string | string[][] | Record<string, string> | URLSearchParams);
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    getAll(name: string): string[];
    has(name: string): boolean;
    set(name: string, value: string): void;
    toString(): string;
    forEach(callback: (value: string, key: string, parent: URLSearchParams) => void, thisArg?: any): void;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    entries(): IterableIterator<[string, string]>;
}
