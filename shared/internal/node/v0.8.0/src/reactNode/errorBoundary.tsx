import React from 'react';

class ErrorBoundary extends React.Component<any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    const nodeName = this.props.noodlNode.model.type.split('.')[1]
    R.libs.mantine?.MantineError('Системная ошибка!', `Node "${nodeName}" render error: ${error} ${errorInfo}`)
    log.error(error, errorInfo)
  }

  render() {
    //@ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI      
      return <h2>Что-то пошл не так...</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary