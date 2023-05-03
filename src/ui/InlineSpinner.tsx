import clsx from 'clsx';
import S from './InlineSpinner.module.scss';


/**
 * Аттрибуты \<InlineSpinner/>
 */
export type InlineSpinnerProps = {
	/** Текст, который будет выведен после спиннера, если не указан - спиннер будет сделан как единственный \<span/> */
	text?: string;
	/** Требуется ли центрировать спиннер (только если укзаан text) */
	center?: boolean;
};


/**
 * Отображает спиннер как inline-елемент (если не указан text), или как block-элемент (если указан text)
 * @param props аттрибуты
 * @returns 
 */
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