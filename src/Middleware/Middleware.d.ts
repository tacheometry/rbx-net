export type AugmentationMiddleware<T extends Array<unknown>, StartType = Array<unknown>> = (
	args: StartType,
) => T | undefined;
