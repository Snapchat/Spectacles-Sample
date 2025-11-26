export type HeadersInit = [string, string][] | Record<string, string> | Headers;
export declare class Headers {
    private headersMap;
    constructor(init?: HeadersInit);
    append(name: string, value: string): void;
    delete(name: string): void;
    entries(): IterableIterator<[string, string]>;
    forEach(callback: (value: string, key: string, parent: Headers) => void, thisArg?: any): void;
    get(name: string): string | null;
    has(name: string): boolean;
    keys(): IterableIterator<string>;
    set(name: string, value: string): void;
    values(): IterableIterator<string>;
    [Symbol.iterator](): IterableIterator<[string, string]>;
    toLensStudioHeaders(): Record<string, string>;
    static fromLensStudioHeaders(lsHeaders: any): Headers;
    private normalizeName;
    private validateHeaderName;
    private validateHeaderValue;
}
