import { useState, useRef, useCallback } from "preact/hooks";


export type LocalFileReaderProps = {
	accept?: string;
	onLoad: (data: ArrayBuffer, name: string) => void;
	onError?: ((name: string, error: ProgressEvent<FileReader>) => void) | string;
};

export function LocalFileReader({ accept, onLoad, onError }: LocalFileReaderProps )
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
			onLoad(fr.result as ArrayBuffer, fileName);
		};
		fr.onerror = (error) => {
			if ('string' == typeof onError)
				alert(onError); else
			if (onError)
				onError(fileName, error);
			
			setInputEnabled(true);
		};
		fr.readAsArrayBuffer(fileRef.current.files[0]);
	}, [onLoad, onError]);
	
	return (
		<input type="file" ref={fileRef} disabled={! inputEnabled} onInput={fileSelected} accept={accept} />
	);
}
