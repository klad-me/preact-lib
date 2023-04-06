import S from './Main.module.scss';
import { CX, CustomPopupProps, TextField } from '@preact-lib/ui';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { Panel, ProgressBar, getUiTheme, setUiTheme, GridContainer, GridPadding, LocalFileReader, RowItem } from '@preact-lib/ui';
import { ScreenBlankElement, PopupElement, popup, ask, customPopup, SpinnerElement, useSpinner, NumberField, IPField } from '@preact-lib/ui';
import { SelectField, BitsField, TabContainer, Tab, DateField, TimeField, DateTimeField, UnixTimeField, HHMMField, JsonEditor } from '@preact-lib/ui';
import { Screen } from '@preact-lib/ui';
import { useTimeout, useOrientation } from '@preact-lib/hooks';
import { JsonObjectSchema } from '@preact-lib/types';


function MyCustomPopup({onClose}: CustomPopupProps)
{
	return (
		<div>
			<header>Custom header</header>
			<p>Text</p>
			<nav>
				<button onClick={onClose}>Close</button>
			</nav>
		</div>
	)
}


function EditorTest()
{
	const [ textValue, setTextValue ] = useState("Text Value");
	const textValidator = useCallback( (value: string) => value.length >= 5, []);

	const [ numberValue, setNumberValue ] = useState(123);
	const numberValidator = useCallback( (value: number) => (value >= 100) && (value <= 200), []);

	const [ ipValue, setIpValue ] = useState("192.168.4.1");
	const ipValidator = useCallback( (value: string) => {
		return value.startsWith('192.');
	}, []);

	const [ selectValue, setSelectValue ] = useState(5);

	const [ dateValue, setDateValue ] = useState(new Date());

	return (
		<div>
			<RowItem name="TextField test">
				<TextField value={textValue} onInput={setTextValue} validator={textValidator} />
			</RowItem>
			<RowItem name="NumberField test">
				<NumberField value={numberValue} onInput={setNumberValue} validator={numberValidator} min={101} max={199}/>
			</RowItem>
			<RowItem name="IPField test">
				<IPField value={ipValue} onInput={setIpValue} validator={ipValidator} />
			</RowItem>
			<RowItem name="SelectField test">
				<SelectField value={selectValue} onInput={setSelectValue} items={{1: "One", 2: "Two", 3: "Three", 5: "Five"}} />
			</RowItem>
			<RowItem name="BitsField test">
				<BitsField value={numberValue} onInput={setNumberValue} items={{1: "One", 2: "Two", 3: "Three", 5: "Five"}} />
			</RowItem>
			<RowItem name="BitsField test (horizontal)">
				<BitsField value={numberValue} onInput={setNumberValue} items={["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]} layout="horizontal" />
			</RowItem>
			<RowItem name="DateField test">
				<DateField value={dateValue} onInput={setDateValue} />
			</RowItem>
			<RowItem name="TimeField test">
				<TimeField value={dateValue} onInput={setDateValue} />
			</RowItem>
			<RowItem name="DateTimeField test">
				<DateTimeField value={dateValue} onInput={setDateValue} />
			</RowItem>
			<RowItem name="UnixTimeField test">
				<UnixTimeField value={numberValue} onInput={setNumberValue} />
			</RowItem>
			<RowItem name="HHMMField test">
				<HHMMField value={numberValue} onInput={setNumberValue} />
			</RowItem>
		</div>
	)
}


const testJsonSchema: JsonObjectSchema = {
	name: 'Тест json',
	type: 'object',
	content: {
		num: {
			name: 'Число',
			type: 'number',
		},
		str: {
			name: 'Строка',
			type: 'string',
			if: 'num < 100',
		},
		bool: {
			name: 'Бул',
			type: 'boolean',
			items: [ 'Откл', 'Вкл' ],
		},
		sel: {
			name: 'Выбор',
			type: 'select',
			items: [ 'Раз', 'Два', 'Три' ],
		},
		bits: {
			name: 'Биты',
			type: 'bits',
			items: [ 'Раз', 'Два', 'Три' ],
		},
		obj: {
			if: '$.bool',
			name: 'Объект',
			type: 'object',
			content: {
				sub1: {
					name: 'Число 2',
					type: 'number',
				},
				sub2: {
					name: 'Строка 2',
					type: 'string',
				}
			}
		},
		numArr: {
			name: 'Массив чисел',
			type: 'array',
			content: {
				name: '="Число"+$',
				type: 'number',
			}
		},
		objArr: {
			name: 'Массив объектов',
			type: 'array',
			content: {
				name: '="Объект "+(["Раз", "Два", "Три"])[$]',
				type: 'object',
				content: {
					num: {
						name: 'Число',
						type: 'number',
					},
					str: {
						name: 'Строка',
						type: 'string',
					}
				}
			}
		}
	},
};

let testJsonData = {
	num: 123,
	str: 'hello world',
	bool: false,
	sel: 1,
	bits: 10,
	obj: {
		sub1: 10,
		sub2: 'wow',
	},
	numArr: [ 1, 2, 3 ],
	objArr: [ { num: 10, str: 'hello' }, { num: 20, str: 'world' } ],
};


function JsonEditorTest()
{
	const onChange = useCallback( () => {
		console.log("json changed")
	}, [])
	return (
		<Panel title="Тест JsonEditor">
			<JsonEditor value={testJsonData} schema={testJsonSchema} onChange={onChange} />
		</Panel>
	);
}


function ScreenMain()
{
	const [ buttonState1, setButtonState1 ] = useState(false);
	const [ buttonState2, setButtonState2 ] = useState(false);

	const changeTheme = useCallback( () => {
		setUiTheme( (getUiTheme() == 'dark') ? 'light' : 'dark' );
		popup("Theme", "Theme changed !")
	}, [])

	const onFileLoad = useCallback( (data: ArrayBuffer, name: string) => {
		console.log("Load ok", name, data)
	}, []);

	const popupTest = useCallback( () => {
		popup("Popup 1", "Content 1", () => console.log("Popup1 closed"));
		popup("Popup 2", "Content 2", () => console.log("Popup2 closed"));
		customPopup(<MyCustomPopup />);
		ask("Ask", "Ask test", () => console.log("OK"), () => console.log("Cancel"))
	}, []);

	const [ spinnerVisible, setSpinnerVisible ] = useState(false);
	useSpinner(spinnerVisible);

	const [ setT, resetT ] = useTimeout( () => {
		setSpinnerVisible(false);
	}, []);

	const showSpinner = useCallback( () => {
		setSpinnerVisible(true);
		setT(3000);
	}, [])

	const orientation = useOrientation();

	return (
		<div class={S.mainContainer}>
			<ScreenBlankElement />
			<PopupElement />
			<SpinnerElement />
			
			<GridContainer>
				<Panel title="Panel 1" toggleable open={false}>
					<button onClick={changeTheme}>Сменить тему</button>
					<header>Hello world</header>
					<button onClick={() => setButtonState1(v => !v)} class={CX(S.button, S.button1)}>Click me !</button>
					<button onClick={() => setButtonState2(v => !v)} class={CX(S.button, S.button2)}>And me !</button>
					<p class={CX(S.result, buttonState1 && S.style1, buttonState2 && S.style2)}>Result 1</p>
					<p class={CX(S.result, { [S.style1]: buttonState2, [S.style2]: buttonState1})}>Result 2</p>

					<Panel title="Заголовок">
						Hello world
					</Panel>
					<ProgressBar percent={80} />
				</Panel>
				<GridPadding />
				<Panel title="Panel 2">
					<div>Orientation: {orientation}</div>
					<LocalFileReader onLoad={onFileLoad} />
					<button onClick={popupTest}>Popup test</button>
					<button onClick={showSpinner}>Spinner test</button>
				</Panel>
				<Panel title="Panel 3">
					<RowItem name="Row name" value="Row value" unit="Unit" />
					<RowItem name="Row2 name" unit="Unit2">
						<button>Row2 button</button>
					</RowItem>
					<EditorTest />
					<JsonEditorTest />
				</Panel>
				<Panel title="Tabs test">
					<TabContainer current={1} buttons='bottom'>
						<Tab name="Hello">
							Hello world
						</Tab>
						<Tab name="World">
							World hello
						</Tab>
					</TabContainer>
				</Panel>
			</GridContainer>
		</div>
	);
}


export function ScreenHeader()
{
	return <div class={S.screenHeader}>Заголовок страницы</div>;
}


export function Main()
{
	return (
		<Screen>
			<header><ScreenHeader/></header>
			<main><ScreenMain /></main>
			<footer>Footer here</footer>
		</Screen>
	)
}