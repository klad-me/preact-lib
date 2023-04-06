
export function makeArray<T>(size: number, cb: (index: number) => T): T[]
{
	let A: T[]=[];
	for (let i=0; i<size; i++)
		A[i]=cb(i)
	return A;
}
