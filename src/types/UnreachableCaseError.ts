/**
 * Ловушка для необработанных состояний switch-case
 * 
 * switch (value)
 * {
 *   case 1: ...
 *   case 2: ...
 *   default: throw new UnreachableCaseError(value);
 * }
 */

export class UnreachableCaseError extends Error
{
	constructor(val: never)
	{
		super(`Unreachable case: ${JSON.stringify(val)}`);
	}
}