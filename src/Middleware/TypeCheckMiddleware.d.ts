import { AugmentationMiddleware } from "./Middleware";

type CheckLike<T> = (value: unknown) => value is T;
type InferValue<T> = T extends CheckLike<infer A> ? A : never;
type Convert<T> = { [K in keyof T]: InferValue<T[K]> };

declare const typeCheckMiddleware: <T extends Array<CheckLike<any>>>(
	...checks: T
) => AugmentationMiddleware<Convert<T>>;
export = typeCheckMiddleware;
