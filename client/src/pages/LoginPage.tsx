import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/LoginPage.css';
import FormCard from '../components/FormCard';
import { fetchCurrentUser } from '../services/authService';

type LoginFormData = {
  email: string;
  password: string;
};

const API_URL = 'http://localhost:3000/api';

function LoginPage() {
  const navigate = useNavigate();

  const VIDEO_URL =
    'https://res.cloudinary.com/dj5kb9v78/video/upload/v1771434311/assets/intro_tu8teq.mp4';

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      setError('Debes ingresar tu correo institucional');
      return;
    }

    if (!email.endsWith('@ucb.edu.bo')) {
      setError('Debes usar tu correo institucional @ucb.edu.bo');
      return;
    }

    if (!password.trim()) {
      setError('Debes ingresar tu contraseña');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Correo o contraseña incorrectos');
      }

      const token = data.accessToken || data.token;

      if (!token) {
        throw new Error('El backend no devolvió un token de acceso');
      }

      localStorage.setItem('accessToken', token);

      try {
        await fetchCurrentUser();
      } catch {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }

      navigate('/home', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al iniciar sesión'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <video className="background-video" autoPlay muted loop playsInline>
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <div className="login-overlay"></div>

      <FormCard>
        <div className="login-header">
          <p className="login-brand">GETA - UCB</p>
          <h1 className="login-title">GeTa</h1>
          <p className="login-subtitle">Comparte, Opina y Diviértete</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo institucional</label>
            <input
              type="email"
              id="email"
              placeholder="tu.nombre@ucb.edu.bo"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />

            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            <span>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
            <span className="button-arrow">→</span>
          </button>
        </form>

        <div className="login-NoAccount">
          <p className="register-text">
            ¿No tienes cuenta?
            <Link to="/register"> Regístrate Aquí</Link>
          </p>
        </div>
      </FormCard>
    </main>
  );
}

export default LoginPage;