
export function sleep(ms: number)
{
	return new Promise( function(resolve, reject) {
		setTimeout(resolve, ms);
	});
}
