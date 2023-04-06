import S from './ProgressBar.module.scss';


type ProgressBarProps = {
	percent: number;
};


export function ProgressBar({percent}: ProgressBarProps)
{
	if (percent < 0) percent=0; else
	if (percent > 100) percent=100;
	
	let percentString=percent + '%';
	
	return (
		<div class={S.progressBar}>
			<div style={{ width: percentString }}>{percentString}</div>
		</div>
	);
}
