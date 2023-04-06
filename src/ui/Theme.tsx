import S from './Theme.module.scss';


type UiThemeList = 'light' | 'dark';

export function setUiTheme(theme: UiThemeList): void
{
	switch (theme)
	{
		case 'light':
			document.body.classList.remove(S.darkTheme);
			break;
		
		case 'dark':
			if (! document.body.classList.contains(S.darkTheme))
				document.body.classList.add(S.darkTheme);
			break;
	}
}


export function getUiTheme(): UiThemeList
{
	if (document.body.classList.contains(S.darkTheme))
		return 'dark'; else
		return 'light';
}


// Определяем тему браузера
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	setUiTheme('dark');
}

// Меняем тему, если она изменилась
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
	setUiTheme(event.matches ? 'dark' : 'light');
});
