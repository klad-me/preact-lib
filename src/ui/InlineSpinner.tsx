import clsx from 'clsx';
import S from './InlineSpinner.module.scss';


type InlineSpinnerProps = {
	text?: string;
	center?: boolean;
};


export function InlineSpinner(props: InlineSpinnerProps)
{
	if (props.text !== undefined)
	{
		return (
			<div class={clsx(S.container, props.center && S.center)}>
				<span class={S.spinner} />
				<span class={S.text}>{props.text}</span>
			</div>
		);
	} else
	{
		return <span class={S.spinner} />;
	}
}