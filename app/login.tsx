import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PASSWORD = 'Novalife2035'; // à personnaliser

export default function LoginPage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('novalife_auth');
      if (isAuth === 'true') {
        setShowLogout(true);
      }
    }
  }, [router]);

  const [showLogout, setShowLogout] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem('novalife_auth', 'true');
      router.replace('/');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('novalife_auth');
    setShowLogout(false);
    router.replace('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 20% 20%, #0f2027 0%, #2c5364 100%)',
      color: '#fff',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(20, 30, 50, 0.85)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '350px',
      }}>
        <h1 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 700,
          fontSize: '2rem',
          marginBottom: '20px',
          letterSpacing: '2px',
        }}>Bienvenue sur Novalife</h1>
        {showLogout ? (
          <button type="button" onClick={handleLogout} style={{
            background: 'linear-gradient(90deg, #ff6b6b 0%, #185a9d 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px 0 rgba(255, 107, 107, 0.2)',
            marginBottom: '16px',
          }}>
            Déconnexion
          </button>
        ) : (
          <>
            <input
              type="password"
              placeholder="Mot de passe"
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                marginBottom: '16px',
                width: '100%',
                fontSize: '1rem',
              }}
            />
            <button type="submit" style={{
              background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px 0 rgba(67, 206, 162, 0.2)',
            }}>
              Entrer
            </button>
            {error && <p style={{ color: '#ff6b6b', marginTop: '16px' }}>{error}</p>}
          </>
        )}
      </form>
    </div>
  );
}
