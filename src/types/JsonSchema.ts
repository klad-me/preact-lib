/**
 * Базовый тип для элемента JSON-схемы
 */
export type JsonSchemaBase = {
	/** Название */
	name: string;
	/** Условие видимости (js-выражение) */
	if?: string;
	/** Флаг открыт/свернут по-умолчанию для объектов/массивов */
	open?: boolean;
};


/**
 * Тип для описания boolean-значения JSON-схемы
 */
export type JsonBooleanSchema = JsonSchemaBase & {
	type: 'boolean';
	/** Значения для false и true */
	items: [ string, string ];
};


/**
 * Тип для описание number-значения JSON-схемы
 */
export type JsonNumberSchema = JsonSchemaBase & {
	type: 'number';
	/** Количество знаков после запятой */
	dp?: number;
	/** Допустимый диапазон значений [min,max] */
	range?: [ number, number ];
};


/**
 * Тип для описания select-значения JSON-схемы
 */
export type JsonSelectSchema = JsonSchemaBase & {
	type: 'select';
	/** Привязка ключ-значение */
	items: string[] | { [key: number]: string };
};


/**
 * Тип для описания bits-значения JSON-схемы
 */
export type JsonBitsSchema = JsonSchemaBase & {
	type: 'bits';
	/** Привязка бит-назначение */
	items: string[] | { [key: number]: string };
};


/**
 * Тип для описания string-значения JSON-схемы
 */
export type JsonStringSchema = JsonSchemaBase & {
	type: 'string';
	/** Максимально допустимая длина строки */
	length?: number;
};


/**
 * Тип для описания массива JSON-схемы
 */
export type JsonArraySchema = JsonSchemaBase & {
	type: 'array';
	/** Описание значения элемента */
	content: JsonValueSchema;
	/** Длина массива */
	length?: number | [ number, number ],
};


/**
 * Тип для описания object-значения JSON-схемы
 */
export type JsonObjectSchema = JsonSchemaBase & {
	type: 'object';
	/** Привязка ключ-значение */
	content: { [key: string]: JsonValueSchema; }
};


/**
 * Тип для описания любого значения JSON-схемы
 */
export type JsonValueSchema = JsonBooleanSchema | JsonNumberSchema | JsonSelectSchema | JsonBitsSchema | JsonStringSchema | JsonArraySchema | JsonObjectSchema;
