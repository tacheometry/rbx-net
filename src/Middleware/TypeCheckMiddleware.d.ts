import { ArgumentMiddleware } from "./Middleware";

type CheckLike<T> = (value: unknown) => value is T;
type InferValue<T> = T extends CheckLike<infer A> ? A : never;
type Convert<T> = { [K in keyof T]: InferValue<T[K]> };

type TypeCheckMiddleware<T extends Array<unknown>> = ArgumentMiddleware<Convert<T>>;

/**
 * Type checking middleware for Net
 */
declare const createTypeChecker: <T extends Array<CheckLike<any>>>(...checks: T) => TypeCheckMiddleware<T>;
export = createTypeChecker;
