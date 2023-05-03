import S from './TextField.module.scss';
import { VNode } from 'preact';
import { useRef, useState, useCallback, useEffect } from 'preact/hooks';
import { popup } from './Popup';
import { Event, useTimeout } from '../hooks';
import clsx from 'clsx';
import { useTr } from '../tr';


/** Валидатор для текстового значения */
export type TextFieldValidator = (value: string) => boolean;

/** Обработчик ввода для \<TextField/> */
export type TextFieldOnInput = (value: string) => void;

/** Аттрибуты для \<TextField/> */
export type TextFieldProps =
{
	/** Значение */
	value: string | undefined;
	/** Обработчик ввода, если undefined - значение readonly */
	onInput?: TextFieldOnInput;
	/** Валидатор для значения */
	validator?: TextFieldValidator;
	/** Стиль для \<input/> */
	style?: string;
	/** События для открытия редактора */
	clickEvent?: Event<unknown>;
	/** Тип ввода для \<input/> */
	inputMode?: string;
};


/**
 * Отображает и позволяет радактировать текстовое значение
 * @param props аттрибуты
 * @returns 
 */
export function TextField(props: TextFieldProps)
{
	const tr = useTr();
	const validator = props.validator || ((value) => true);
	const editable = ('function' == typeof props.onInput);

	const [ editorOpen, setEditorOpen ] = useState(false);
	const [ editorText, setEditorText ] = useState(props.value);

	const openEditor = useCallback( () => {
		if ( (editable) && (props.value !== undefined) )
		{
			setEditorOpen(true);
			setEditorText(props.value);
		}
	}, [editable, props.value]);

	props.clickEvent?.use(openEditor, [ openEditor ]);

	const valid = editorOpen ?
		validator(editorText ?? '') :
		(props.value === undefined) || validator(props.value);
	
	const editorOK = useCallback( () => {
		setEditorOpen(false);
		if (valid)
			('function' == typeof props.onInput) && props.onInput(editorText ?? ''); else
			popup(tr, tr("@preact-lib.error", "Ошибка"), tr("@preact-lib.incorrectValue", "Введено некорректное значение."));
	}, [editorText, valid, props.onInput])

	const onInputChanged = useCallback( (e: any) => {
		setEditorText((e.target as HTMLInputElement).value);
	}, [])

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

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect( () => {
		if (inputRef.current)
		{
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [editorOpen])


	if (! editorOpen)
	{
		// Редактор не открыт
		let value: string | VNode = (props.value !== undefined) ? props.value : '...';
		if (! valid) value=<span class={S.incorrect}>{value}</span>;
		return <div class={clsx(S.viewer, editable && S.editable)} onClick={openEditor} key="viewer">{value}</div>;
	} else
	{
		// Редактор открыт
		return (
			<div class={S.editor} key="editor">
				<input
					ref={inputRef}
					class={clsx(S.inputField, ! valid && S.incorrect)}
					inputMode={props.inputMode || 'text'}
					value={editorText}
					onInput={onInputChanged}
					onKeyUp={onInputKey}
					onBlur={setBlurTimer}
					onFocus={resetBlurTimer}
					style={props.style}
					/>
				<button class={S.buttonOk} onClick={editorOK}>OK</button>
			</div>
		);
	}
}
