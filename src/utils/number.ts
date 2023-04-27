
export function zeroPad(v: number, len: number): string
{
	let s=String(v);
	while (s.length < len) s='0'+s;
	return s;
}


export function toHex(value: number, len?: number): string
{
	if ('number' != typeof len) len=0;
	if (value < 0) value=0x100000000 + value;
	let s=value.toString(16).toUpperCase();
	while (s.length < len) s='0'+s;
	return s;
}


export function BV(n: number): number
{
	return 1 << n;
}


export function numberEnding(value: number, names: [string, string, string])
{
	let n=value % 100;
	
	if ( (n >= 11) && (n <= 19) )
	{
		return names[2];
	} else
	{
		switch (n % 10)
		{
			case 1:  return names[0];
			case 2:
			case 3:
			case 4:  return names[1];
			default: return names[2];
		}
	}
}
