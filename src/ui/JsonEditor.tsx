import S from './JsonEditor.module.scss';

import { JsonObjectSchema, JsonArraySchema, JsonValueSchema } from '../types';
import { useCallback, useContext, useState } from 'preact/hooks';
import { ComponentChildren, createContext, VNode } from 'preact';
import { useEvent, Event } from '../hooks';
import { TextField } from './TextField';
import { NumberField } from './NumberField';
import { SelectField } from './SelectField';
import { BitsField } from './BitsField';
import { evalExpr } from '../utils';
import { useTr } from '@preact-lib/tr';
import { IPField } from './IPField';


const rightArrow='\u25B7', downArrow='\u25BD';
const rightArrowBlack='\u25B6', downArrowBlack='\u25BC';


type JsonEditorContextType = {
	root?: any;
	onChange?: (value: any) => void;
	ev?: Event<any>;
};

const JsonEditorContext = createContext<JsonEditorContextType>({})


function pad(level: number, text: string)
{
	return <span style={"padding-left: "+level+"rem"}>{text}</span>;
}


function ifExpr(schema: JsonValueSchema, value: { [key: string]: any }, updateFn: (arg: any) => void)
{
	if (schema.if === undefined) return true;
	const context=useContext(JsonEditorContext);
	context.ev?.use( () => updateFn({}), [] );
	try
	{
		return evalExpr(schema.if, { '$': context.root, ...value });
	} catch (e)
	{
		return true;
	}
}


type HeaderProps = {
	title?: string;
	schema: JsonValueSchema;
	level: number;
	open: boolean;
	setOpen: (value: boolean) => void;
	children?: ComponentChildren;
};


function Header(props: HeaderProps)
{
	const onClick = useCallback( () => {
		props.setOpen(! props.open);
	}, [props.open, props.setOpen]);

	return (
		<tr onClick={onClick} class={S.clickable}>
			<td>{pad(props.level, (props.open ? downArrow : rightArrow ) + ' ' + (props.title ?? props.schema.name))}</td>
			<td>{props.children}</td>
		</tr>
	)
}


function fromIPv4(ip: number): string
{
	return String((ip >> 24) & 0xff) + '.' + String((ip >> 16) & 0xff) + '.' + String((ip >> 8) & 0xff) + '.' + String(ip & 0xff);
}


function toIPv4(text: string): number
{
	const re = text.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
	if (! re) return 0;
	const num = ((parseInt(re[1]) << 24) | (parseInt(re[2]) << 16) | (parseInt(re[3]) << 8) | parseInt(re[4]));
	return ((parseInt(re[1]) << 24) | (parseInt(re[2]) << 16) | (parseInt(re[3]) << 8) | parseInt(re[4]));
}


type EditValueProps = {
	title?: string;
	value: any;
	name: string;
	schema: JsonValueSchema;
	level: number;
};


function EditValue(props: EditValueProps)
{
	const [ , update ] = useState({});
	if (! ifExpr(props.schema, props.value, update)) return null;

	const context = useContext(JsonEditorContext);
	const ev = useEvent();
	const value=props.value[props.name];
	let editor: VNode;

	function onInput(value: any)
	{
		switch (props.schema.type)
		{
			case 'boolean':
				props.value[props.name]=Boolean(value);
				break;
			
			case 'ipv4':
				props.value[props.name]=toIPv4(value);
				break;

			default:
				props.value[props.name]=value;
				break;
		}
		('function' == typeof context.onChange) && context.onChange(context.root);
		update({});
	}
	
	switch (props.schema.type)
	{
		case 'string':
			{
				const len = props.schema.length ?? 0;
				editor=<TextField value={String(value)} onInput={onInput} validator={(len > 0) ? (s) => (s.length <= len) : undefined} clickEvent={ev} />
			}
			break;
		
		case 'number':
			{
				const range = props.schema.range;
				editor=<NumberField value={Number(value)} dp={props.schema.dp} validator={range ? (v) => ( (v >= range[0]) && (v <= range[1]) ) : undefined} onInput={onInput} clickEvent={ev} />
			}
			break;
		
		case 'ipv4':
			editor=<IPField value={fromIPv4(Number(value))} onInput={onInput} clickEvent={ev} />
			break;

		case 'boolean':
			editor=<SelectField value={Number(Boolean(value))} onInput={onInput} items={props.schema.items} clickEvent={ev} />
			break;
		
		case 'select':
			editor=<SelectField value={Number(value)} onInput={onInput} items={props.schema.items} clickEvent={ev} />
			break;
		
		case 'bits':
			editor=<BitsField value={Number(value)} onInput={onInput} items={props.schema.items} />
			break;
		
		default:
			editor=<div/>;
			break;
	}

	return (
		<tr class={S.clickable}>
			<td onClick={ev.emit}>{pad(props.level, props.title ?? props.schema.name)}</td>
			<td>{editor}</td>
		</tr>
	);
}


type EditArrayProps = {
	title?: string;
	value: any;
	schema: JsonArraySchema;
	level: number;
};


function EditArray(props: EditArrayProps)
{
	const [ , update ] = useState({});
	if (! ifExpr(props.schema, props.value, update)) return null;

	const [ open, setOpen ] = useState(props.schema.open ?? true);
	const context = useContext(JsonEditorContext);
	const header = <Header title={props.title} schema={props.schema} level={props.level} open={open} setOpen={setOpen} />;
	function makeName(idx: number): string
	{
		const name=props.schema.content.name;
		if (name.startsWith('='))
		{
			name.substring(1);
			try
			{
				return evalExpr(name.substring(1), { '$': idx });
			} catch (e)
			{
				return '(#' + (idx+1) + ')';
			}
		} else
		{
			return name + ' #' + (idx+1);
		}
	}
	const list = (! open)
		? null
		: (props.value as Array<any>).map( (item, idx) => <EditItem title={makeName(idx)} value={props.value} name={String(idx)} schema={props.schema.content} level={props.level+1} /> );
	return <>{header}{list}</>
}


type EditObjectProps = {
	title?: string;
	value: any;
	schema: JsonObjectSchema;
	level: number;
};


function EditObject(props: EditObjectProps)
{
	const [ , update ] = useState({});
	if (! ifExpr(props.schema, props.value, update)) return null;

	const [ open, setOpen ] = useState(props.schema.open ?? true);
	const context = useContext(JsonEditorContext);
	const header = (props.value != context.root) ? <Header title={props.title} schema={props.schema} level={props.level} open={open} setOpen={setOpen} /> : null;
	const list = (! open)
		? null
		: Object.keys(props.schema.content).map( (key) => <EditItem value={props.value} name={key} schema={props.schema.content[key]} level={props.level+1} /> );

	return <>{header}{list}</>;
}


type EditItemProps = {
	title?: string;
	value: any;
	name: string;
	schema: JsonValueSchema;
	level: number;
};


function EditItem(props: EditItemProps)
{
	if ( (props.value === undefined) || (props.value[props.name] === undefined) )
		return null;
	let item = props.value[props.name];

	switch (props.schema.type)
	{
		case 'array':
			return <EditArray title={props.title} value={item} schema={props.schema} level={props.level+1} />;
		
		case 'object':
			return <EditObject title={props.title} value={item} schema={props.schema} level={props.level+1} />;

		case 'bits':
		case 'boolean':
		case 'number':
		case 'ipv4':
		case 'select':
		case 'string':
			return <EditValue title={props.title} value={props.value} name={props.name} schema={props.schema} level={props.level+1} />;
		
		default:
			return null;
	}
}


/**
 * Аттрибуты \<JsonEditor/>
 */
export type JsonEditorProps = {
	/** Объект для редактирования */
	value: any;
	/** Схема */
	schema: JsonObjectSchema;
	/** Обработчик изменения значения */
	onChange?: (value: any) => void;
};


/**
 * Позволяет отображать и редактировать объект согласно указанной JSON-схеме
 * @param props аттрибуты
 * @returns 
 */
export function JsonEditor(props: JsonEditorProps)
{
	const tr = useTr();
	const ev=useEvent<any>();

	const onChange = useCallback( () => {
		ev.emit(props.value);
		if ('function' == typeof props.onChange)
			props.onChange(props.value);
	}, [ props.onChange, props.value ]);

	return (
		<JsonEditorContext.Provider value={{ root: props.value, onChange, ev}}>
			<div class={S.container} key={props.value}>
				<table>
					<thead>
						<tr>
							<th>{tr("@preact-lib.param", "Параметр")}</th>
							<th>{tr("@preact-lib.value", "Значение")}</th>
						</tr>
					</thead>
					<tbody>
						<EditObject value={props.value} schema={props.schema} level={-1} />
					</tbody>
				</table>
			</div>
		</JsonEditorContext.Provider>
	);
}