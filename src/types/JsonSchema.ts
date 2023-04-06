export type JsonSchemaBase = {
	name: string;
	if?: string;
	open?: boolean;
};


export type JsonBooleanSchema = JsonSchemaBase & {
	type: 'boolean';
	items: [ string, string ];
};


export type JsonNumberSchema = JsonSchemaBase & {
	type: 'number';
	dp?: number;
	range?: [ number, number ];
};


export type JsonSelectSchema = JsonSchemaBase & {
	type: 'select';
	items: string[] | { [key: number]: string };
};


export type JsonBitsSchema = JsonSchemaBase & {
	type: 'bits';
	items: string[] | { [key: number]: string };
};


export type JsonStringSchema = JsonSchemaBase & {
	type: 'string';
	length?: number;
};


export type JsonArraySchema = JsonSchemaBase & {
	type: 'array';
	content: JsonValueSchema;
	length?: number | [ number, number ],
};


export type JsonObjectSchema = JsonSchemaBase & {
	type: 'object';
	content: { [key: string]: JsonValueSchema; }
};


export type JsonValueSchema = JsonBooleanSchema | JsonNumberSchema | JsonSelectSchema | JsonBitsSchema | JsonStringSchema | JsonArraySchema | JsonObjectSchema;
