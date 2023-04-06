// @ts-ignore
if (DEBUG) require("preact/debug");

import { render } from 'preact';
import { Main } from './Main';

// Mount main component
render(<Main />, document.getElementById('appMain') as HTMLDivElement);
