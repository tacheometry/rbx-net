import throttler from "./Throttle";
import Serializer from "./Serializer";
import config from "./configuration";
import { functionExists, eventExists, ServerTickFunctions, TypeGuard, StaticArguments, TypeGuards } from "./internal";
import NetServerEvent from "./ServerEvent";
import NetClientEvent from "./ClientEvent";
import NetClientFunction from "./ClientFunction";
import NetServerFunction from "./ServerFunction";
import NetGlobalEvent from "./GlobalEvent";
import NetGlobalServerEvent from "./GlobalServerEvent";
import NetServerAsyncFunction from "./ServerAsyncFunction";
import NetClientAsyncFunction from "./ClientAsyncFunction";
import NetServerEventV2 from "./ServerEventV2";
import createRateLimiter from "./Middleware/RateLimitMiddleware";
import createTypeChecker from "./Middleware/TypeCheckMiddleware";

const runService = game.GetService("RunService");

const IS_CLIENT = (__LEMUR__ && !runService.IsServer()) || runService.IsClient();
const IS_SERVER = runService.IsServer();

interface ICreateFunctionOptions {
	name: string;
	callback?: Callback;
	cacheSeconds?: number;
	rateLimit?: number;
}

/**
 * Typescript Networking Library for ROBLOX
 */
namespace Net {
	interface VersionType {
		major: number;
		minor: number;
		revision: number;
	}
	interface VersionInformation {
		number: VersionType;
		date: number;
		tag?: string;
	}

	export const SetConfiguration = config.SetConfiguration;
	export const SetClientConfiguration = config.SetClientConfiguration;
	export const GetConfiguration = config.GetConfiguration;

	/**
	 * Version information
	 * @internal
	 */
	export const VERSION: VersionInformation = {
		number: { major: 1, minor: 2, revision: 0 },
		date: 190602,
		tag: IS_LUA_MODULE !== undefined ? "lua" : "ts",
	};

	setmetatable(VERSION, {
		__tostring: (self) => {
			const { major, minor, revision } = self.number;

			return `${major}.${minor}.${revision}${IS_LUA_MODULE !== undefined ? "-lua" : ""}`;
		},
	});

	/**
	 * The old ServerEvent
	 * @version 1
	 */
	export const LegacyServerEvent = NetServerEvent;
	export type LegacyServerEvent = NetServerEvent;

	/**
	 * Server Event
	 * @version 2
	 */
	export const ServerEvent = NetServerEventV2;
	export type ServerEvent = NetServerEventV2;

	export const ClientEvent = NetClientEvent;
	export type ClientEvent = NetClientEvent;

	export const ClientFunction = NetClientFunction;
	export type ClientFunction<SR = unknown> = NetClientFunction<SR>;

	export const ClientAsyncFunction = NetClientAsyncFunction;
	export type ClientAsyncFunction = NetClientAsyncFunction;

	export const ServerFunction = NetServerFunction;
	export type ServerFunction = NetServerFunction;

	export const ServerAsyncFunction = NetServerAsyncFunction;
	export type ServerAsyncFunction = NetServerAsyncFunction;

	export const GlobalEvent = NetGlobalEvent;
	export type GlobalEvent = NetGlobalEvent;

	export const GlobalServerEvent = NetGlobalServerEvent;
	export type GlobalServerEvent = NetGlobalServerEvent;

	export function IsClient() {
		return IS_CLIENT;
	}

	export function IsServer() {
		return IS_SERVER;
	}

	export const Serialize = Serializer.Serialize;
	export const Deserialize = Serializer.Deserialize;
	export const IsSerializable = Serializer.IsSerializable;

	/**
	 * Create a function
	 * @param nameOrOptions The name of the function
	 * @rbxts server
	 */
	export function CreateFunction(nameOrOptions: string | ICreateFunctionOptions): NetServerFunction {
		if (IS_SERVER) {
			if (typeIs(nameOrOptions, "string")) {
				return new NetServerFunction(nameOrOptions);
			} else {
				const fn = new NetServerFunction(nameOrOptions.name);

				if (nameOrOptions.callback) {
					fn.SetCallback(nameOrOptions.callback);
				}

				if (nameOrOptions.cacheSeconds) {
					fn.SetClientCache(nameOrOptions.cacheSeconds);
				}

				return fn;
			}
		} else {
			throw "Net.createFunction can only be used on the server!";
		}
	}

	/**
	 * Create an event
	 * @param name The name of the event
	 * @rbxts server
	 */
	export function CreateEvent(name: string): NetServerEvent {
		if (IS_SERVER) {
			return new NetServerEvent(name);
		} else {
			throw "Net.createFunction can only be used on the server!";
		}
	}

	// tslint:disable:jsdoc-format
	/**
	 * Wait for a client function specified by `name`
	 *
	 * Usage
	 *
	```ts
	Net.WaitForClientFunctionAsync("FunctionName").then(func => {
	func.Callback = clientCallbackFunction;
	}, err => {
	warn("Error fetching FunctionName:", err);
	});```
	 *
	 * Or inside an async function:
	```ts
	const func = await Net.WaitForClientFunctionAsync("FunctionName");
	func.Callback = clientCallbackFunction;
	```
	 *
	 * @param name The name of the function
	 * @alias for `Net.ClientFunction.WaitFor(name)`
	 * @returns `Promise<Net.ClientFunction>`
	 * @rbxts client
	 */
	// tslint:enable:jsdoc-format
	export async function WaitForClientFunctionAsync<R extends any>(name: string) {
		return NetClientFunction.WaitFor<R>(name);
	}

	// tslint:disable:jsdoc-format
	/**
	 * Wait for a client function specified by `name`
	 *
	 * Usage
	 *
	```ts
	Net.WaitForClientEventAsync("EventName").then(event => {
	event.Connect(eventHandler);
	}, err => {
	warn("Error fetching EventName:", err);
	});```
	 *
	 * Or inside an async function:
	```ts
	const event = await Net.WaitForClientEventAsync("EventName");
	event.Connect(eventHandler);
	```
	 *
	 * @param name The name of the function
	 * @alias for `Net.ClientEvent.WaitFor(name)`
	 * @returns `Promise<Net.ClientEvent>`
	 * @rbxts client
	 */
	// tslint:enable:jsdoc-format
	export async function WaitForClientEventAsync(name: string) {
		return NetClientEvent.WaitFor(name);
	}

	if (IS_SERVER) {
		let lastTick = 0;
		ServerTickFunctions.push(() => {
			if (tick() > lastTick + GetConfiguration("ServerThrottleResetTimer")) {
				lastTick = tick();
				throttler.Clear();
			}
		});
	}

	/**
	 * Rate Limiting Middleware
	 */
	export const RateLimited = createRateLimiter;

	/**
	 * Static type guard middleware
	 */
	export const Typed = createTypeChecker;
}

export = Net;
