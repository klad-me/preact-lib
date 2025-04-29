import { useCallback } from 'preact/hooks';
import S from './LanguageButtons.module.scss';


type LanguageButtonProps<T> = {
	value: T;
	onClick: (value: T) => void;
};


export function LanguageButton<T extends string>(props: LanguageButtonProps<T>)
{
	const onClick = useCallback( () => {
		props.onClick(props.value);
	}, [props.value]);

	return (
		<div class={S.container} onClick={onClick}>
			{props.value[0].toUpperCase() + props.value.slice(1)}
		</div>
	)
}