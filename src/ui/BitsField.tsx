import S from './BitsField.module.scss';
import clsx from 'clsx';
import { BV } from '../utils';
import { Event } from '../hooks';
import { useState } from 'preact/hooks';
import { useTr } from '../tr';


export type BitsFieldOnInput = (value: number) => void;


/** Аттрибуты \<BitsFiled/> */
export type BitsFieldProps =
{
	/** Значение */
	value: number | undefined;
	/** Обработчик ввода, если он не указан, то значение readonly */
	onInput?: BitsFieldOnInput;
	/** Маска отключенных элеметов (битов), они выводиться в список не будут */
	disabledMask?: number;
	/** Расположение списка битов */
	layout?: 'vertical' | 'horizontal';
	/** Привязка бит-назначение */
	items: string[] | { [key: number]: string };
	/** Событие для открытия редкатора */
	clickEvent?: Event<unknown>;
	/** Требуется ли развернуть список сразу */
	open?: boolean;
};


/**
 * Отображает и позволяет редактирование числовое значение путем изменения конкретных битов
 * @param props аттрибуты
 * @returns 
 */
export function BitsField(props: BitsFieldProps)
{
	const [ open, setOpen ] = useState(props.open ?? false);
	const editable = ('function' == typeof props.onInput) && ('number' == typeof props.value);
	const keys = Object.keys(props.items);
	const disabledMask = props.disabledMask || 0;
	const value = Number(props.value) & ~disabledMask;
	const tr = useTr();

	props.clickEvent?.use( () => {
		setOpen( (prev: boolean) => ! prev );
	}, [])

	function onInput(bit: number)
	{
		if ( ('number' == typeof props.value) && (editable) && ('function' == typeof props.onInput) )
			props.onInput(value ^ BV(bit));
	}

	if (! open)
	{
		let count=0;
		Object.keys(props.items).map(Number).map( (key) => {
			if (value & BV(key)) count++;
		});
		return <div onClick={() => setOpen(true)}>{tr("@preact-lib.Nselected", "%1 выбрано", count)}</div>;
	} else
	{
		return (
			<div class={S[props.layout ?? 'vertical']}>
				{
					Object.keys(props.items).map(Number).map( (key) => (
						<label class={clsx(editable && S.editable, (disabledMask & BV(key)) && S.disabled )} key={key}>
							<input
								type="checkbox"
								key={key}
								class={clsx(editable && S.editable)}
								checked={(value & BV(key)) != 0}
								onInput={ () => onInput(key) }
								disabled={ (! editable) || ('number' != typeof props.value) || ((disabledMask & BV(key)) != 0)}
								/>
							{props.items[key]}
						</label>
					))
				}
			</div>
		);
	}
}
