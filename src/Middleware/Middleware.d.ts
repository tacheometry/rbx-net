export type ArgumentMiddleware<T extends Array<unknown>, StartType = Array<unknown>> = (
	args: StartType,
) => T | undefined;

export interface ArgumentMiddlewareFunction<Input extends Array<unknown>, Output extends Array<unknown>> {
	(args: Input): Output | undefined;
}
