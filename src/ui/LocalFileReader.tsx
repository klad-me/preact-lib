import { useState, useRef, useCallback } from "preact/hooks";


/**
 * Аттрибуты для \<LocalFileReader/>
 */
export type LocalFileReaderProps = {
	/** Допустимые форматы файлов (аттрибут accept \<input/>) */
	accept?: string;
	/** Обработчик успешной загрузки файла */
	onLoad: (data: ArrayBuffer, name: string) => void;
	/** Обработчик ошибки загрузки файла или текст ошибки */
	onError?: ((name: string, error: ProgressEvent<FileReader>) => void) | string;
};


/**
 * Позволяет загружать файл с локального диска
 * @param props аттрибуты
 * @returns 
 */
export function LocalFileReader(props: LocalFileReaderProps )
{
	const fileRef = useRef<HTMLInputElement>(null);
	const [ inputEnabled, setInputEnabled ] = useState(true);
	
	const fileSelected = useCallback( () => {
		if ( (! fileRef.current) || (! fileRef.current.files) || (fileRef.current.files.length == 0) ) return;

		// Прячем выбор файла
		setInputEnabled(false);
		
		// Получаем имя файла
		const fileName=fileRef.current.files[0].name;

		// Читаем файл
		let fr=new FileReader();
		fr.onload = () => {
			setInputEnabled(true);
			props.onLoad(fr.result as ArrayBuffer, fileName);
		};
		fr.onerror = (error) => {
			if ('string' == typeof props.onError)
				alert(props.onError); else
			if (props.onError)
				props.onError(fileName, error);
			
			setInputEnabled(true);
		};
		fr.readAsArrayBuffer(fileRef.current.files[0]);
	}, [props.onLoad, props.onError]);
	
	return (
		<input type="file" ref={fileRef} disabled={! inputEnabled} onInput={fileSelected} accept={props.accept} />
	);
}
