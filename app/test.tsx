export default function TestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#222',
      color: '#fff',
      fontSize: '2rem',
      fontFamily: 'sans-serif',
    }}>
      <div>
        <h1>Page de test Next.js</h1>
        <p>Si tu vois ce message, la page fonctionne !</p>
      </div>
    </div>
  );
}
