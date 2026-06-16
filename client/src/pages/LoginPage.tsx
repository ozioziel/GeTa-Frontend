import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import FormCard from '../components/FormCard';
import ThemeToggleButton from '../components/common/ThemeToggleButton';
import {
  establishSession,
  loginRequest,
  resetPasswordRequest,
} from '../services/authService';

type LoginFormData = {
  email: string;
  password: string;
};

type RecoveryPhase = 'hidden' | 'request' | 'verify' | 'reset';

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
  const [showRecoveryOption, setShowRecoveryOption] = useState<boolean>(false);
  const [recoveryPhase, setRecoveryPhase] = useState<RecoveryPhase>('hidden');
  const [recoveryCode, setRecoveryCode] = useState<string>('');
  const [enteredRecoveryCode, setEnteredRecoveryCode] = useState<string>('');
  const [recoveryPassword, setRecoveryPassword] = useState<string>('');
  const [recoveryRepeatPassword, setRecoveryRepeatPassword] = useState<string>('');
  const [recoveryMessage, setRecoveryMessage] = useState<string>('');

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
      setShowRecoveryOption(false);
      const authPayload = await loginRequest({ email, password });
      await establishSession(authPayload);
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocurrio un error al iniciar sesion';
      setError(message);
      if (message === 'Invalid credentials') {
        setShowRecoveryOption(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const startRecovery = () => {
    setError('');
    setRecoveryMessage('');
    setRecoveryPhase('request');
    setRecoveryCode('');
    setEnteredRecoveryCode('');
    setRecoveryPassword('');
    setRecoveryRepeatPassword('');
  };

  const cancelRecovery = () => {
    setRecoveryPhase('hidden');
    setRecoveryMessage('');
    setRecoveryCode('');
    setEnteredRecoveryCode('');
    setRecoveryPassword('');
    setRecoveryRepeatPassword('');
  };

  const sendRecoveryCode = () => {
    const email = formData.email.trim();

    if (!email) {
      setRecoveryMessage('Debes ingresar tu correo institucional para enviar el codigo');
      return;
    }

    if (!email.endsWith('@ucb.edu.bo')) {
      setRecoveryMessage('Debes usar tu correo institucional @ucb.edu.bo');
      return;
    }

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setRecoveryCode(generatedCode);
    setRecoveryPhase('verify');
    setRecoveryMessage('Codigo generado. Usalo en el siguiente paso.');
  };

  const verifyRecoveryCode = () => {
    if (!enteredRecoveryCode.trim()) {
      setRecoveryMessage('Debes ingresar el codigo de seguridad');
      return;
    }

    if (enteredRecoveryCode.trim() !== recoveryCode) {
      setRecoveryMessage('El codigo no coincide. Intenta de nuevo.');
      return;
    }

    setRecoveryPhase('reset');
    setRecoveryMessage('Codigo correcto. Ingresa tu nueva contrasena.');
  };

  const handleResetPassword = async () => {
    const email = formData.email.trim();

    if (!recoveryPassword.trim()) {
      setRecoveryMessage('Debes ingresar la nueva contrasena');
      return;
    }

    if (recoveryPassword !== recoveryRepeatPassword) {
      setRecoveryMessage('Las contrasenas no coinciden');
      return;
    }

    try {
      setLoading(true);
      await resetPasswordRequest({ email, newPassword: recoveryPassword });
      setError('Contrasena restablecida correctamente. Inicia sesion con tu nueva contraseña.');
      cancelRecovery();
      setShowRecoveryOption(false);
    } catch (err) {
      setRecoveryMessage(
        err instanceof Error ? err.message : 'No se pudo restablecer la contrasena',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <ThemeToggleButton className="theme-toggle-floating" />

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

        {showRecoveryOption && recoveryPhase === 'hidden' && (
          <div className="recovery-hint">
            <p>Si olvidaste tu contraseña, puedes recuperarla aquí.</p>
            <button
              type="button"
              className="recovery-link"
              onClick={startRecovery}
            >
              Recuperar contraseña
            </button>
          </div>
        )}

        {recoveryPhase !== 'hidden' && (
          <div className="recovery-panel">
            <h2>Recuperar contraseña</h2>
            <p className="recovery-description">
              Ingresa tu correo institucional y sigue los pasos para reestablecer la contraseña.
            </p>

            {recoveryPhase === 'request' && (
              <>
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
                </div>
                <button
                  type="button"
                  className="login-button"
                  onClick={sendRecoveryCode}
                  disabled={loading}
                >
                  Enviar codigo de seguridad
                </button>
              </>
            )}

            {recoveryPhase === 'verify' && (
              <>
                <div className="recovery-code-display">
                  <span>Codigo de seguridad:</span>
                  <strong>{recoveryCode}</strong>
                </div>
                <div className="form-group">
                  <label htmlFor="recoveryCode">Ingresa el codigo</label>
                  <input
                    type="text"
                    id="recoveryCode"
                    placeholder="123456"
                    value={enteredRecoveryCode}
                    onChange={(event) => setEnteredRecoveryCode(event.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  type="button"
                  className="login-button"
                  onClick={verifyRecoveryCode}
                  disabled={loading}
                >
                  Verificar codigo
                </button>
              </>
            )}

            {recoveryPhase === 'reset' && (
              <>
                <div className="form-group">
                  <label htmlFor="recoveryPassword">Nueva contraseña</label>
                  <input
                    type="password"
                    id="recoveryPassword"
                    placeholder="Nueva contraseña"
                    value={recoveryPassword}
                    onChange={(event) => setRecoveryPassword(event.target.value)}
                    disabled={loading}
                  />

                  <label htmlFor="recoveryRepeatPassword">Repite la contraseña</label>
                  <input
                    type="password"
                    id="recoveryRepeatPassword"
                    placeholder="Repite la contraseña"
                    value={recoveryRepeatPassword}
                    onChange={(event) => setRecoveryRepeatPassword(event.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  type="button"
                  className="login-button"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  Restablecer contraseña
                </button>
              </>
            )}

            {recoveryMessage && <p className="login-error">{recoveryMessage}</p>}

            <div className="recovery-actions">
              <button
                type="button"
                className="recovery-cancel"
                onClick={cancelRecovery}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

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
