import '../styles/LoginPage.css'
import FormCard from '../components/FormCard'

function LoginPage(){
    const VIDEO_URL = 'https://res.cloudinary.com/dj5kb9v78/video/upload/v1771434311/assets/intro_tu8teq.mp4';

    return (
        <main className="login-page">
            
            <video className='background-video' autoPlay muted loop playsInline>
                <source src = {VIDEO_URL} type = "video/mp4"/>
            </video>
            <div className='login-overlay'></div>
          
            <FormCard>
                <div className='login-header'>
                    <p className='login-brand'> GETA - UCB</p>
                    <h1 className='login-title'>GeTa </h1>
                    <p className = 'login-subtitle'> Comparte, Opina y Diviertete</p>
                </div>
                <form className='login-form'>
                    <div className='form-group'>
                        <label htmlFor="email"> Correo institucional </label>
                        <input type="email" id="email" placeholder='tu.nombre@ucb.edu.bo'/>
                        <label htmlFor="password"> Contraseña </label>
                        <input type="password" id="password" placeholder='********'/>
                    </div>
                </form>

                <button type = "submit" className='login-button'>
                    <span>Iniciar Sesión</span>
                    <span className='button-arrow'>→</span>
                </button>
                <div className='login-NoAccount'>
                    <p className = 'register-text'> 
                        ¿No tienes cuenta?
                        <a href="#"> Registrate Aqui </a>
                    </p>

                </div>
            </FormCard>
        </main>
    );
}

export default LoginPage;