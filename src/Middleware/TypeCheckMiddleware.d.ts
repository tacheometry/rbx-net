import { ArgumentMiddleware } from "./Middleware";

type CheckLike<T> = (value: unknown) => value is T;
type InferValue<T> = T extends CheckLike<infer A> ? A : never;
type Convert<T> = { [K in keyof T]: InferValue<T[K]> };

/**
 * Type checking middleware for Net
 */
declare const types: <T extends Array<CheckLike<any>>>(...checks: T) => ArgumentMiddleware<Convert<T>>;
export = types;
