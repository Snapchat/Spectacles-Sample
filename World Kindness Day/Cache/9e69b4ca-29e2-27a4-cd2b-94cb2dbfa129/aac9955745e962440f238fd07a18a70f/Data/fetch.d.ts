import { Request, RequestInit } from './Request';
type URL = any;
export declare function fetch(input: string | URL | Request, init?: RequestInit): Promise<Response>;
export {};
