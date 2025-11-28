import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // You can log the error to an error reporting service here
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '20px',
          background: '#2b2b2b',
          color: 'white'
        }}>
          <h1 style={{ fontSize: 36, marginBottom: 12 }}>Se produjo un error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', maxWidth: '90%', overflow: 'auto' }}>
            {this.state.error?.message}
          </pre>
          <p style={{ marginTop: 12 }}>Revisa la consola del navegador para más detalles.</p>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
