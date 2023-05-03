
/**
 * Промис для ожидания
 * @param ms время ожидания
 * @returns 
 * 
 * @example
 * await sleep(1000);
 */
export function sleep(ms: number)
{
	return new Promise<void>( function(resolve, reject) {
		setTimeout(resolve, ms);
	});
}
