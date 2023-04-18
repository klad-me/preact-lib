import S from './BitsField.module.scss';
import clsx from 'clsx';
import { BV } from '../utils';
import { Event } from '../hooks';
import { useState } from 'preact/hooks';


export type BitsFieldOnInput = (value: number) => void;

export type BitsFieldProps =
{
	value: number | undefined;
	onInput?: BitsFieldOnInput;
	disabledMask?: number;
	layout?: 'vertical' | 'horizontal';
	items: string[] | { [key: number]: string };
	clickEvent?: Event<unknown>;
	open?: boolean;
};


export function BitsField(props: BitsFieldProps)
{
	const [ open, setOpen ] = useState(props.open ?? false);
	const editable = ('function' == typeof props.onInput) && ('number' == typeof props.value);
	const keys = Object.keys(props.items);
	const disabledMask = props.disabledMask || 0;
	const value = Number(props.value) & ~disabledMask;

	props.clickEvent.use( () => {
		setOpen( (prev: boolean) => ! prev );
	}, [])

	function onInput(bit: number)
	{
		if ( ('number' == typeof props.value) && (editable) )
			props.onInput(value ^ BV(bit));
	}

	if (! open)
	{
		let count=0;
		Object.keys(props.items).map(Number).map( (key) => {
			if (value & BV(key)) count++;
		});
		return <div onClick={() => setOpen(true)}>{count} выбрано</div>;
	} else
	{
		return (
			<div class={S[props.layout ?? 'vertical']}>
				{
					Object.keys(props.items).map( (key) => (
						<label class={clsx(editable && S.editable, (disabledMask & BV(Number(key))) && S.disabled )} key={key}>
							<input
								type="checkbox"
								key={key}
								class={clsx(editable && S.editable)}
								checked={(value & BV(Number(key))) != 0}
								onInput={ () => onInput(Number(key)) }
								disabled={ (! editable) || ('number' != typeof props.value) || ((disabledMask & BV(Number(key))) != 0)}
								/>
							{props.items[key]}
						</label>
					))
				}
			</div>
		);
	}
}
