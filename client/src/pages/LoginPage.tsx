import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import FormCard from '../components/FormCard';
import { establishSession, loginRequest } from '../services/authService';

type LoginFormData = {
  email: string;
  password: string;
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTarget = location.state?.from
    ? `${location.state.from.pathname || '/home'}${location.state.from.search || ''}`
    : '/home';

  const videoUrl =
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
      setError('Debes ingresar tu contrasena');
      return;
    }

    try {
      setLoading(true);
      const authPayload = await loginRequest({ email, password });
      await establishSession(authPayload);
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ocurrio un error al iniciar sesion',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <video className="background-video" autoPlay muted loop playsInline>
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div className="login-overlay"></div>

      <FormCard>
        <div className="login-header">
          <p className="login-brand">GETA - UCB</p>
          <h1 className="login-title">GeTa</h1>
          <p className="login-subtitle">Comparte, opina y conectate con tu comunidad</p>
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

            <label htmlFor="password">Contrasena</label>
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
            <span>{loading ? 'Iniciando sesion...' : 'Iniciar sesion'}</span>
            <span className="button-arrow">{'->'}</span>
          </button>
        </form>

        <div className="login-NoAccount">
          <p className="register-text">
            No tienes cuenta?
            <Link to="/register"> Registrate aqui</Link>
          </p>
        </div>
      </FormCard>
    </main>
  );
}

export default LoginPage;
