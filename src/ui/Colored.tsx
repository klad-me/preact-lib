import clsx from 'clsx';
import S from './Colored.module.scss';


type ColoredProps = {
	value: string;
	red?: boolean;
	yellow?: boolean;
	green?: boolean;
}


export function Colored(props: ColoredProps)
{
	return <span class={clsx(props.red && S.red, props.yellow && S.yellow, props.green && S.green)}>{props.value}</span>;
}
