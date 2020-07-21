import { AugmentationMiddleware } from "./Middleware/Middleware";

declare interface ServerEventV2 {
	Connect(callback: (player: Player, ...args: Array<unknown>) => void): RBXScriptConnection;
}

type EnhancedServerEventV2<M0 = defined, M1 = defined, M2 = defined, M3 = defined> = M3 extends AugmentationMiddleware<
	infer A,
	infer _
>
	? AugmentedServerEventV2<A>
	: M2 extends AugmentationMiddleware<infer A, infer _>
	? AugmentedServerEventV2<A>
	: M1 extends AugmentationMiddleware<infer A, infer _>
	? AugmentedServerEventV2<A>
	: M0 extends AugmentationMiddleware<infer A, infer _>
	? AugmentedServerEventV2<A>
	: ServerEventV2;

type InferPrevType<T> = T extends AugmentationMiddleware<infer A> ? A : never;

declare interface AugmentedServerEventV2<C extends Array<unknown>> {
	Connect(callback: (player: Player, ...args: C) => void): RBXScriptConnection;
}

declare interface ServerEventConstructor {
	new (name: string): ServerEventV2;
	new <M0 extends AugmentationMiddleware<any>>(name: string, middlware: [M0]): EnhancedServerEventV2<M0>;
	new <M0 extends AugmentationMiddleware<any>, M1 extends AugmentationMiddleware<any, InferPrevType<M0>>>(
		name: string,
		middlware: [M0, M1],
	): EnhancedServerEventV2<M0, M1>;
	new <
		M0 extends AugmentationMiddleware<any>,
		M1 extends AugmentationMiddleware<any, InferPrevType<M0>>,
		M2 extends AugmentationMiddleware<any, InferPrevType<M1>>
	>(
		name: string,
		middlware: [M0, M1, M2],
	): EnhancedServerEventV2<M0, M1, M2>;
}

declare const ServerEventV2: ServerEventConstructor;
export = ServerEventV2;
