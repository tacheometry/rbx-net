import { NetManagedEvent } from "../internal";

export type NextCaller = (player: defined, ...args: Array<unknown>) => void;

export type LegacyMiddleware<T extends Array<unknown>, StartType extends Array<unknown> = Array<unknown>> = (
	args: StartType,
	player: Player,
	evt: NetManagedEvent,
) => T;

export type Middleware<
	CallArguments extends Array<unknown> = Array<unknown>,
	PreviousCallArguments extends Array<unknown> = Array<unknown>,
	Sender = Player,
	PreviousSender = Player
> = (
	next: (player: Sender, ...args: CallArguments) => void,
	event: NetManagedEvent,
) => (sender: PreviousSender, ...args: PreviousCallArguments) => void;

// export interface MiddlewareFunc<Input extends Array<unknown>, Output extends Array<unknown>> {
// 	(args: Input, player: Player, evt: NetManagedEvent): Output;
// }

// export interface NetMiddleware
