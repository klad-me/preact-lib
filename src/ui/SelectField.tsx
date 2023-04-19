import S from './SelectField.module.scss';
import { useRef, useState, useCallback, useEffect } from 'preact/hooks';
import { Event, useTimeout } from '../hooks';
import clsx from 'clsx';


export type SelectFieldOnInput = (value: number) => void;

export type SelectFieldProps =
{
	value: number | undefined;
	onInput?: SelectFieldOnInput;
	items: string[] | { [key: number]: string };
	style?: string;
	clickEvent?: Event<unknown>;
};


export function SelectField(props: SelectFieldProps)
{
	const editable = ('function' == typeof props.onInput);

	const [ editorOpen, setEditorOpen ] = useState(false);

	const openEditor = useCallback( () => {
		if ( (editable) && (props.value !== undefined) )
		{
			setEditorOpen(true);
		}
	}, [editable, props.value]);

	props.clickEvent?.use(openEditor, [openEditor]);

	const editorOK = useCallback( () => {
		setEditorOpen(false);
		if ( (inputRef.current) && ('function' == typeof props.onInput) )
		{
			let value = Number(inputRef.current.value);
			if ('string' == typeof props.items[value])
				props.onInput(value);
		}
	}, [props.onInput, props.items])

	const onInputKey = useCallback( (e: KeyboardEvent) => {
		switch (e.key)
		{
			case 'Enter':
				editorOK();
				break;
			
			case 'Escape':
				setEditorOpen(false);
				break;
		}
	}, [editorOK]);

	const [ setBlurTimer, resetBlurTimer ] = useTimeout(() => setEditorOpen(false), [], 1000);

	const inputRef = useRef<HTMLSelectElement>(null);

	useEffect( () => {
		if (inputRef.current)
			inputRef.current.focus();
	}, [editorOpen]);


	if (! editorOpen)
	{
		// Редактор не открыт
		return (
			<div class={clsx(S.viewer, editable && S.editable)} onClick={openEditor} key="viewer">
				{ (props.value === undefined) ? '...' : ( ('string' == typeof props.items[props.value]) ? props.items[props.value] : '('+props.value+')' ) }
			</div>
		);
	} else
	{
		// Редактор открыт
		let select=Object.keys(props.items).map( (key) => <option value={key}>{props.items[Number(key)]}</option> );
		
		return (
			<div class={S.editor} key="editor">
				<select
					ref={inputRef}
					class={S.inputField}
					value={props.value}
					onBlur={setBlurTimer}
					onFocus={resetBlurTimer}
					onKeyUp={onInputKey}
					style={props.style}
					>
					${select}
				</select>
				<button class={S.buttonOk} onClick={editorOK}>OK</button>
			</div>
		);
	}
}
