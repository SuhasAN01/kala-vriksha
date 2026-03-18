/**
 * Custom Next.js error page — shown for 404, 500, and unhandled errors.
 * Prevents a raw white screen for production errors.
 */
export default function ErrorPage({ statusCode }) {
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
      <h1 style={{ color: '#D4AF37', fontSize: 80, margin: 0 }}>{statusCode || '?'}</h1>
      <h2 style={{ color: '#D4AF37', margin: '12px 0' }}>Kala Vriksha</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 480, marginBottom: 28 }}>
        {statusCode === 404
          ? 'This sacred path does not exist. The page you are looking for has returned to the universe.'
          : 'An unexpected error has occurred on our servers. Please try again shortly.'}
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

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
