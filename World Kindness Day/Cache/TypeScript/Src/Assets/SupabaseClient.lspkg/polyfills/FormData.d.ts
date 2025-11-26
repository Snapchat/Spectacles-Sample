type FormDataEntryValue = string | Blob;
export declare class FormData {
    private _entries;
    constructor(form?: any);
    private initializeFromForm;
    append(name: string, value: FormDataEntryValue, filename?: string): void;
    delete(name: string): void;
    get(name: string): FormDataEntryValue | null;
    getAll(name: string): FormDataEntryValue[];
    has(name: string): boolean;
    set(name: string, value: FormDataEntryValue, filename?: string): void;
    entries(): IterableIterator<[string, FormDataEntryValue]>;
    forEach(callback: (value: FormDataEntryValue, key: string, parent: FormData) => void, thisArg?: any): void;
    keys(): IterableIterator<string>;
    values(): IterableIterator<FormDataEntryValue>;
    [Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]>;
    private validateName;
}
export {};
