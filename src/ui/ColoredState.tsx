import { Colored } from "./Colored";


/** Аттрибуты \<ColoredState/> */
type ColoredStateProps = {
	/** Состояние */
	value: number | undefined;
	/** Соответствие состояния названию */
	items: string[] | { [key: number]: string };
};


/**
 * Отображает раскрашенное состояние. Цвет состояния задается первым символом:<br/>
 * '!' - красный<br/>
 * '~' - желтый<br/>
 * '+' - зеленый<br/>
 * В остальных случаях подсветки цветом не будет
 * @param props аттрибуты
 * @returns 
 */
export function ColoredState(props: ColoredStateProps)
{
	let text='...', red=false, yellow=false, green=false;
	if (props.value !== undefined)
	{
		text=props.items[props.value];
		if (text === undefined)
		{
			text='(#'+props.value+')';
			red=true;
		} else
		if (text[0] == '!')
		{
			text=text.substring(1);
			red=true;
		} else
		if (text[0] == '~')
		{
			text=text.substring(1);
			yellow=true;
		} else
		if (text[0] == '+')
		{
			text=text.substring(1);
			green=true;
		}
	}
	return <Colored value={text} red={red} yellow={yellow} green={green} />;
}