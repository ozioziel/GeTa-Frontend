import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';
import FormCard from '../components/FormCard';

type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function RegisterPage() {
  const navigate = useNavigate();

  const [lightPosition, setLightPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const dialogues = [
    <>BIENVENIDO.</>,
    <>ESTE ES UN ESPACIO PARA <span>COMPARTIR</span>.</>,
    <>UN LUGAR PARA OPINAR, EXPRESARTE Y CONECTAR CON OTROS ESTUDIANTES.</>,
    <>ANTES DE ENTRAR... NECESITAMOS CONOCERTE.</>,
    <>CREA TU CUENTA.</>,
  ];

  const [dialogueIndex, setDialogueIndex] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string>('');

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    setLightPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleDialogueClick = () => {
    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
      return;
    }

    setShowForm(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Debes ingresar tu nombre completo');
      return;
    }

    if (!formData.email.trim()) {
      setError('Debes ingresar tu correo');
      return;
    }

    if (!formData.email.endsWith('@ucb.edu.bo')) {
      setError('Debes usar tu correo institucional @ucb.edu.bo');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    navigate('/career-selection', {
      state: {
        registerData: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        },
      },
    });
  };

  return (
    <main className="register-page" onMouseMove={handleMouseMove}>
      <div
        className="cursor-light"
        style={{
          left: `${lightPosition.x}px`,
          top: `${lightPosition.y}px`,
        }}
      ></div>

      {!showForm ? (
        <section
          className="register-dialogue-screen"
          onClick={handleDialogueClick}
        >
          <div className="register-light"></div>

          <div className="dialogue-content">
            <p className="dialogue-text">
              {dialogues[dialogueIndex]}
            </p>

            <p className="dialogue-hint">
              Haz click para continuar
            </p>
          </div>
        </section>
      ) : (
        <div className="register-form-container">
          <FormCard>
            <div className="register-header">
              <p className="register-brand">GETA - UCB</p>
              <h1 className="register-title">Crear Cuenta</h1>
              <p className="register-subtitle">
                Completa tus datos para empezar en GeTa
              </p>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Nombre completo</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Juan Pérez"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="email">Correo institucional</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="tu.nombre@ucb.edu.bo"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="register-error">{error}</p>}

              <button type="submit" className="register-button">
                <span>Continuar</span>
                <span className="button-arrow">→</span>
              </button>
            </form>

            <div className="login-text">
              <p>
                ¿Ya tienes cuenta?
                <Link to="/"> Inicia sesión</Link>
              </p>
            </div>

            <button
              type="button"
              className="back-dialogue-button"
              onClick={() => {
                setShowForm(false);
                setDialogueIndex(0);
              }}
            >
              Volver al inicio
            </button>
          </FormCard>
        </div>
      )}
    </main>
  );
}

export default RegisterPage;