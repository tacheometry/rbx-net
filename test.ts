import Net from "./src";
import typeCheckMiddleware from "./src/Middleware/TypeCheckMiddleware";
import ServerEventV2 from "./src/ServerEventV2";
import { AugmentationMiddleware } from "./src/Middleware/Middleware";

const toPlayer = ([playerName]: [string]): [Player, string] | undefined => {
	const player = game.GetService("Players").FindFirstChild(playerName);
	if (player !== undefined) {
		return [player as Player, player.Name];
	}
};

const tc = typeCheckMiddleware((value: unknown): value is string => true);

const test = new ServerEventV2("test", [tc, toPlayer]);

test.Connect((plr, otherPlr, otherPlrName) => {
	print(otherPlr);
});
