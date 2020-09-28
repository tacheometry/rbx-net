import { LegacyMiddleware } from "./Middleware";

export function createArgumentMiddleware<M0 extends LegacyMiddleware<any>>(m0: M0): void;
export function createArgumentMiddleware(...mw: Array<LegacyMiddleware<any>>) {}
