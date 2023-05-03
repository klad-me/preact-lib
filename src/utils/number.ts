
/**
 * Дополнить число нулями слева до указанной лины
 * @param v число
 * @param len требуемая длина
 * @returns строка
 * 
 * @example
 * zeroPad(123, 5) => '00123'
 */
export function zeroPad(v: number, len: number): string
{
	let s=String(v);
	while (s.length < len) s='0'+s;
	return s;
}


/**
 * Преобразовать число в hex-строку укзанной длины (дополняет нулями слева, если необходимо)
 * @param value число
 * @param len требуемая длина
 * @returns строка
 * 
 * @example
 * toHex(1234, 4) => '04D2'
 */
export function toHex(value: number, len?: number): string
{
	if ('number' != typeof len) len=0;
	if (value < 0) value=0x100000000 + value;
	let s=value.toString(16).toUpperCase();
	while (s.length < len) s='0'+s;
	return s;
}


/**
 * Вернуть значение бита (2^n)
 * @param n номер бита
 * @returns значение бита
 */
export function BV(n: number): number
{
	return 1 << n;
}


/**
 * Вернуть текст количества по значению
 * @param value число
 * @param names окончания [ для 1, для 2/3/4, для 5+ ]
 * @returns нужное окончения в зависимости от числа
 * 
 * @example
 * const endings = [ 'яйцо', 'яйца', 'яиц' ];
 * numberEnding(7, endings) => 'яиц'
 * numberEnding(21, endings) => 'яйцо'
 * numberEnding(103, endings) => 'яйца'
 */
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
