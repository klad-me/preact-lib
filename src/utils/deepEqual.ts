const isObject = (object: any) => (object != null) && (typeof object === "object");


function isDeepEqual(object1: any, object2: any): boolean
{
	const objKeys1 = Object.keys(object1);
	const objKeys2 = Object.keys(object2);

	if (objKeys1.length !== objKeys2.length) return false;
  
	for (var key of objKeys1)
	{
		const value1 = object1[key];
		const value2 = object2[key];

		const isObjects = isObject(value1) && isObject(value2);
  
		if ( (isObjects && !isDeepEqual(value1, value2)) || (!isObjects && value1 !== value2))
			return false;
	}
	return true;
};


/**
 * Глубокое сравнение двух объектов по значениям
 * @param object1 объект 1
 * @param object2 объект 2
 * @returns true, если объекты идентичны
 */
export function deepEqual(object1: any, object2: any): boolean
{
	if (isObject(object1) && isObject(object2))
		return isDeepEqual(object1, object2); else
		return object1 === object2;
}
