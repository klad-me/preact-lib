import { Component, ComponentChild, ComponentChildren, RenderableProps } from "preact";


type ErrorBoundaryProps = {
	children: ComponentChildren;
};


type ErrorBoundaryState = {
	error: Error | undefined;
};


export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState>
{
	static getDerivedStateFromError(error: Error)
	{
		return { error };
	}


	componentDidCatch(error: Error)
	{
		this.setState({ error });
	}


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