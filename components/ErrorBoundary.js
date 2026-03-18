import React from 'react';

/**
 * React Error Boundary - catches render-time JS errors and prevents white screen.
 * Wraps the entire app in _app.js.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[Kala Vriksha] Render error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a1f0e 0%, #1a3a20 100%)',
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
          padding: 40,
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#D4AF37', fontSize: 48, marginBottom: 8 }}>🌿</h1>
          <h2 style={{ color: '#D4AF37', marginBottom: 16 }}>Kala Vriksha</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24, maxWidth: 500 }}>
            Something went wrong. The sacred tree is resting. Please refresh the page to continue your journey.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #B8960C)',
              color: '#000',
              border: 'none',
              padding: '12px 32px',
              borderRadius: 30,
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: 16
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{ marginTop: 24, color: '#ff6b6b', fontSize: 12, maxWidth: 700, textAlign: 'left', background: 'rgba(0,0,0,0.4)', padding: 16, borderRadius: 8, overflow: 'auto' }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
