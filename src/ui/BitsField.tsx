import S from './BitsField.module.scss';
import clsx from 'clsx';
import { BV } from '../utils';


export type BitsFieldOnInput = (value: number) => void;

export type BitsFieldProps =
{
	value: number | undefined;
	onInput?: BitsFieldOnInput;
	disabledMask?: number;
	layout?: 'vertical' | 'horizontal';
	items: string[] | { [key: number]: string };
};


export function BitsField(props: BitsFieldProps)
{
	const editable = ('function' == typeof props.onInput) && ('number' == typeof props.value);
	const keys = Object.keys(props.items);
	const disabledMask = props.disabledMask || 0;
	const value = Number(props.value) & ~disabledMask;

	function onInput(bit: number)
	{
		if ( ('number' == typeof props.value) && (editable) )
			props.onInput(value ^ BV(bit));
	}

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
