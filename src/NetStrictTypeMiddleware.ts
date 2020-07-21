export interface Middleware<A = {}> {
	(nextAction: (...args: Array<A>) => (args: Array<unknown>) => void): void;
}

const mw: Middleware = (nextAction) => {
	return () => {};
};
