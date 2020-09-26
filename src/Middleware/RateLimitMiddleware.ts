import { errorft, NetManagedEvent, RequestCounter } from "../internal";
import { ArgumentMiddlewareFunction } from "./Middleware";
import throttler from "../Throttle";
import { GetConfiguration } from "../configuration";

const throttles = new Map<NetManagedEvent, RequestCounter>();

interface RateLimitMiddleware<N extends number> {
	(input: Array<unknown>, player: Player, event: NetManagedEvent): Array<unknown>;
}

/**
 * Creates a throttle middleware for this event
 *
 * Will limit the amount of requests a player can make to this event
 *
 * _NOTE: Must be used before **other** middlewares as it's not a type altering middleware_
 * @param maxRequestsPerMinute The maximum requests per minute
 */
function createRateLimiter<N extends number>(maxRequestsPerMinute: N): RateLimitMiddleware<N> {
	return (input, player, event) => {
		let throttle = throttles.get(event);
		const instance = event.GetInstance();
		if (!throttle) {
			throttle = throttler.Get(instance.GetFullName());
		}

		const count = throttle.Get(player);
		if (count >= maxRequestsPerMinute) {
			errorft(GetConfiguration("ServerThrottleMessage"), {
				player: player.UserId,
				remote: instance.Name,
				limit: maxRequestsPerMinute,
			});
		} else {
			throttle.Increment(player);
		}

		return input;
	};
}
export default createRateLimiter;
