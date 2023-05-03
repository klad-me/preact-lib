import S from './Theme.module.scss';


/** Тема UI */
export type UiTheme = 'light' | 'dark';


/**
 * Установить тему UI
 * @param theme тема
 */
export function setUiTheme(theme: UiTheme): void
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


/**
 * Получить текущую тему UI
 * @returns тема
 */
export function getUiTheme(): UiTheme
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
