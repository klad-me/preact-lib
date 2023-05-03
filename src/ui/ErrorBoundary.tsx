import { Component, ComponentChildren } from "preact";


type ErrorBoundaryProps = {
	children: ComponentChildren;
};


type ErrorBoundaryState = {
	error: Error | undefined;
};


/**
 * Класс-ловушка для обработки ошибок компонентов
 * @example
 * <ErrorBoundary>
 *   <ComponentWithError />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState>
{
	/** @private */
	static getDerivedStateFromError(error: Error)
	{
		return { error };
	}


	/** @private */
	componentDidCatch(error: Error)
	{
		this.setState({ error });
	}


	/** @private */
	render()
	{
		if (this.state.error === undefined)
			return this.props.children;
		
		return (
			<div>
				<p>Application crashed:</p>
				<pre>{this.state.error.toString()}</pre>
				{this.state.error.stack && <pre>{this.state.error.stack?.toString()}</pre>}
			</div>
		);
	}
}