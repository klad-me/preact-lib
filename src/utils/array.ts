
export function makeArray<T>(size: number, cb: (index: number) => T, from?: number): T[]
{
	let A: T[]=[];
	if (from === undefined) from=0;
	for (let i=from; i<size; i++)
		A[i]=cb(i)
	return A;
}
