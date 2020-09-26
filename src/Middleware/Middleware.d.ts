import { NetManagedEvent } from "../internal";

export type ArgumentMiddleware<T extends Array<unknown>, StartType = Array<unknown>> = (
	args: StartType,
	player: Player,
	evt: NetManagedEvent,
) => T;

export interface ArgumentMiddlewareFunction<Input extends Array<unknown>, Output extends Array<unknown>> {
	(args: Input): Output;
}
