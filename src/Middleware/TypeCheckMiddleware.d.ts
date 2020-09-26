import { ArgumentMiddleware } from "./Middleware";

type CheckLike<T> = (value: unknown) => value is T;
type InferValue<T> = T extends CheckLike<infer A> ? A : never;
type Convert<T> = { [K in keyof T]: InferValue<T[K]> };

interface TypeCheckMiddleware<T extends Array<unknown>> extends ArgumentMiddleware<Convert<T>> {
	// TODO:
	readonly dud?: never;
}

/**
 * Type checking middleware for Net
 */
declare const createTypeChecker: <T extends Array<CheckLike<any>>>(...checks: T) => TypeCheckMiddleware<T>;
export = createTypeChecker;
