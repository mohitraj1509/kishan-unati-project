import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0', color: '#ef4444' }}>404</h1>
      <h2 style={{ fontSize: '2rem', margin: '0 0 2rem 0', color: '#374151' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.1rem', margin: '0 0 2rem 0', color: '#6b7280' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#22c55e',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          transition: 'background-color 0.3s ease'
        }}
      >
        Go Home
      </Link>
    </div>
  )
}