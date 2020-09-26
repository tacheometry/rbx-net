import { findOrCreateRemote, IS_CLIENT, NetManagedEvent } from "./internal";
import { ArgumentMiddleware } from "./Middleware/Middleware";

class ServerEventV2<CallArguments extends Array<unknown> = Array<unknown>> implements NetManagedEvent {
	private instance: RemoteEvent;
	public constructor(
		private readonly name: string,
		private readonly middlewares?: Array<ArgumentMiddleware<Array<unknown>>>,
	) {
		this.instance = findOrCreateRemote("RemoteEvent", name);
		assert(!IS_CLIENT, "Cannot create a NetServerEvent on the client!");
	}

	public GetInstance() {
		return this.instance;
	}

	/**
	 * Connect
	 */
	public Connect(callback: (player: Player, ...args: CallArguments) => void): RBXScriptConnection {
		const { middlewares } = this;

		const connection = this.instance.OnServerEvent.Connect((player, ...args) => {
			try {
				if (middlewares) {
					for (const middleware of middlewares) {
						args = middleware(args, player, this);
					}

					callback(player, ...(args as CallArguments));
				}
			} catch (e) {
				warn("[rbx-net] " + tostring(e));
			}
		});

		return connection;
	}
}

type EnhancedServerEventV2<
	M0 = defined,
	M1 = defined,
	M2 = defined,
	M3 = defined,
	M4 = defined,
	M5 = defined
> = M5 extends ArgumentMiddleware<infer A, infer _>
	? ServerEventV2<A>
	: M4 extends ArgumentMiddleware<infer A, infer _>
	? ServerEventV2<A>
	: M3 extends ArgumentMiddleware<infer A, infer _>
	? ServerEventV2<A>
	: M2 extends ArgumentMiddleware<infer A, infer _>
	? ServerEventV2<A>
	: M1 extends ArgumentMiddleware<infer A, infer _>
	? ServerEventV2<A>
	: M0 extends ArgumentMiddleware<infer A, infer _>
	? ServerEventV2<A>
	: ServerEventV2;

type InferPrevType<T> = T extends ArgumentMiddleware<infer A> ? A : never;

export interface ServerEventV2Constructor {
	/**
	 * Creates a new server event
	 *
	 * @param name The name of the event
	 */
	new <T extends Array<unknown>>(name: string): ServerEventV2<T>;

	/**
	 * Creates a new middleware augmented Server Event
	 *
	 * e.g. (using `t`)
	 * ```ts
	 * const myEvent = new Net.ServerEvent("Test", [
	 *		Net.Types(t.string, t.number)
	 * ])
	 * ```
	 * will ensure that events recieved have a `string` and `number` argument.
	 *
	 * @param name The name of the event
	 * @param middlewares The middleware array
	 */
	new <M0 extends ArgumentMiddleware<any>>(name: string, middlewares: [M0]): EnhancedServerEventV2<M0>;
	new <M0 extends ArgumentMiddleware<any>, M1 extends ArgumentMiddleware<any, InferPrevType<M0>>>(
		name: string,
		middlewares: [M0, M1],
	): EnhancedServerEventV2<M0, M1>;
	new <
		M0 extends ArgumentMiddleware<any>,
		M1 extends ArgumentMiddleware<any, InferPrevType<M0>>,
		M2 extends ArgumentMiddleware<any, InferPrevType<M1>>
	>(
		name: string,
		middlewares: [M0, M1, M2],
	): EnhancedServerEventV2<M0, M1, M2>;
	new <
		M0 extends ArgumentMiddleware<any>,
		M1 extends ArgumentMiddleware<any, InferPrevType<M0>>,
		M2 extends ArgumentMiddleware<any, InferPrevType<M1>>,
		M3 extends ArgumentMiddleware<any, InferPrevType<M2>>
	>(
		name: string,
		middlewares: [M0, M1, M2, M3],
	): EnhancedServerEventV2<M0, M1, M2, M3>;
	new <
		M0 extends ArgumentMiddleware<any>,
		M1 extends ArgumentMiddleware<any, InferPrevType<M0>>,
		M2 extends ArgumentMiddleware<any, InferPrevType<M1>>,
		M3 extends ArgumentMiddleware<any, InferPrevType<M2>>,
		M4 extends ArgumentMiddleware<any, InferPrevType<M3>>
	>(
		name: string,
		middlewares: [M0, M1, M2, M3, M4],
	): EnhancedServerEventV2<M0, M1, M2, M3, M4>;
	new <
		M0 extends ArgumentMiddleware<any>,
		M1 extends ArgumentMiddleware<any, InferPrevType<M0>>,
		M2 extends ArgumentMiddleware<any, InferPrevType<M1>>,
		M3 extends ArgumentMiddleware<any, InferPrevType<M2>>,
		M4 extends ArgumentMiddleware<any, InferPrevType<M3>>,
		M5 extends ArgumentMiddleware<any, InferPrevType<M4>>
	>(
		name: string,
		middlewares: [M0, M1, M2, M3, M4, M5],
	): EnhancedServerEventV2<M0, M1, M2, M3, M4, M5>;
}

type NetServerEventV2 = ServerEventV2;
const NetServerEventV2 = ServerEventV2 as ServerEventV2Constructor;
export default NetServerEventV2;
