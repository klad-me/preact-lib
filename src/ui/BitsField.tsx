import S from './BitsField.module.scss';
import clsx from 'clsx';
import { BV } from '../utils';


export type BitsFieldOnInput = (value: number) => void;

export type BitsFieldProps =
{
	value: number | undefined;
	onInput?: BitsFieldOnInput;
	layout?: 'vertical' | 'horizontal';
	items: string[] | { [key: number]: string };
};


export function BitsField(props: BitsFieldProps)
{
	const editable = ('function' == typeof props.onInput) && ('number' == typeof props.value);
	const keys = Object.keys(props.items);
	const value = Number(props.value);

	function onInput(bit: number)
	{
		if ( ('number' == typeof props.value) && (editable) )
			props.onInput(value ^ BV(bit));
	}

	return (
		<div class={S[props.layout ?? 'vertical']}>
			{
				Object.keys(props.items).map( (key) => (
					<label class={clsx(editable && S.editable)} key={key}>
						<input
							type="checkbox"
							key={key}
							class={clsx(editable && S.editable)}
							checked={(value & BV(Number(key))) != 0}
							onInput={ () => onInput(Number(key)) }
							disabled={ (! editable) || ('number' != typeof props.value)}
							/>
						{props.items[key]}
					</label>
				))
			}
		</div>
	);
}
