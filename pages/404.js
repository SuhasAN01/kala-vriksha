/**
 * Custom 404 page for Kala Vriksha.
 * Manually created to satisfy Next.js optimization requirements when using a custom _error.js.
 */
export default function NotFoundPage() {
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
      textAlign: 'center',
      padding: 40
    }}>
      <h1 style={{ color: '#D4AF37', fontSize: 80, margin: 0 }}>404</h1>
      <h2 style={{ color: '#D4AF37', margin: '12px 0' }}>Kala Vriksha</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 480, marginBottom: 28 }}>
        This sacred path does not exist. The page you are looking for has returned to the universe.
      </p>
      <a
        href="/"
        style={{
          background: 'linear-gradient(135deg, #D4AF37, #B8960C)',
          color: '#000',
          padding: '12px 32px',
          borderRadius: 30,
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: 16
        }}
      >
        Return to Home
      </a>
    </div>
  );
}
