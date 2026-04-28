npm create vite@latest


Main -> Section

*
body

--------------------Cosas basicas de css

text-align sirve para alinear texto o contenido inline de un elemento

justify-content depende de display: flex sirve para alinear hijos al eje principal, diamos de manera horizontal

align-items depende de flex o grid, digamos de manera vertical


Margin vs Padding

Padding espacio interno del elemento
Margin es el espacio externo del elemento


-----------------Cosas basicas de html

    input siempre viene con label y form

    form
    <label
    for = (id)
    >
    <input
      id="email"  identificacion
      type="email" tipo
      placeholder="tu.nombre@ucb.edu.bo" que dice
    />


    <button type = "submit" className='login-button'>
        <span>Iniciar Sesión</span>
        <span className='button-arrow'>→</span>
    </button>

    <video className='background-video' autoPlay muted loop playsInline>
                    <source src = {VIDEO_URL} type = "video/mp4"/>
    </video>


    }
.login-overlay{
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
    object-fit: cover;
    background: rgba(0,0,0, 0.45);
}
.login-card{
    position: relative;
    width: 400px; /*el tamanio de width sera de 400 px*/
    padding: 32px; /*el tamanio de los elementos dentro tendran un margen de 32 px*/
    border-radius: 20px; /*Sera redondeado y no cuadrado*/
    background: rgba(31,31,31,0,72);
    color: white;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    inset: 2;


}

-------------------------CSS PARA LOGIN E INPUT
    .login-button{
    height: 50px;
    width: 100%;
    border: none;
    border-radius: 12px;
    background: #ffcc00;
    color: #111;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    
}

.form-group input{
    height: 50px;
    padding: 14px;
    margin-bottom: 20px;
    border: 1px solid #444;
    border-radius: 12px;
    background: #2a2a2a;
    color: white;
}

.login-button:hover{
    box-shadow: 0 0 18px rgba(255,204,0,0.6);
    transform: translateY(-1px)
}