import { User, Post, Comment } from '../types';

export const CAREERS = [
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Derecho',
  'Medicina',
  'Administración de Empresas',
  'Arquitectura',
  'Psicología',
  'Comunicación Social',
  'Contaduría Pública',
  'Ingeniería Civil',
];

// Usuarios mock ampliado
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@ucb.edu.bo',
    career: 'Ingeniería de Sistemas',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    bio: 'Apasionada por el desarrollo web y la inteligencia artificial. Me encanta aprender nuevas tecnologías y compartir conocimiento con la comunidad.'
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@ucb.edu.bo',
    career: 'Arquitectura',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    bio: 'Diseñador arquitectónico enfocado en sostenibilidad y espacios modernos. Siempre buscando nuevas formas de innovar en el diseño urbano.'
  },
  {
    id: '3',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@ucb.edu.bo',
    career: 'Medicina',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    bio: 'Estudiante de medicina con interés en pediatría y salud pública. Comprometida con mejorar el acceso a la salud en comunidades vulnerables.'
  },
  {
    id: '4',
    name: 'Luis Pérez',
    email: 'luis.perez@ucb.edu.bo',
    career: 'Administración de Empresas',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    bio: 'Emprendedor y estudiante de administración. Me interesa el marketing digital y la gestión de proyectos innovadores.'
  },
  {
    id: '5',
    name: 'Sofia Torres',
    email: 'sofia.torres@ucb.edu.bo',
    career: 'Psicología',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    bio: 'Futura psicóloga clínica interesada en terapias cognitivo-conductuales y bienestar mental. Creyente en el poder del autoconocimiento.'
  },
  {
    id: '6',
    name: 'Diego Vargas',
    email: 'diego.vargas@ucb.edu.bo',
    career: 'Derecho',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    bio: 'Estudiante de derecho con enfoque en derechos humanos y justicia social. Participante activo en debates y moot courts.'
  },
  {
    id: '7',
    name: 'Valentina Silva',
    email: 'valentina.silva@ucb.edu.bo',
    career: 'Comunicación Social',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    bio: 'Comunicadora social apasionada por el periodismo digital y las redes sociales. Me encanta contar historias que generen impacto.'
  },
  {
    id: '8',
    name: 'Roberto Flores',
    email: 'roberto.flores@ucb.edu.bo',
    career: 'Ingeniería Civil',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
    bio: 'Ingeniero civil en formación con pasión por la infraestructura sostenible y la construcción de puentes. Siempre aprendiendo.'
  },
  {
    id: '9',
    name: 'Camila Morales',
    email: 'camila.morales@ucb.edu.bo',
    career: 'Contaduría Pública',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    bio: 'Contadora pública con interés en auditoría y finanzas corporativas. Me gusta el análisis financiero y la planificación estratégica.'
  },
  {
    id: '10',
    name: 'Andrés Suárez',
    email: 'andres.suarez@ucb.edu.bo',
    career: 'Ingeniería Industrial',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop',
    bio: 'Ingeniero industrial enfocado en optimización de procesos y lean manufacturing. Apasionado por la mejora continua.'
  }
];

// Posts mock con más variedad
export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    content: '¡Hola a todos! 👋 Acabo de terminar mi proyecto de tesis sobre inteligencia artificial aplicada a la educación. Fue un proceso desafiante pero muy gratificante. ¿Alguien más trabajando en temas similares?',
    author: MOCK_USERS[0],
    career: MOCK_USERS[0].career,
    likes: 24,
    createdAt: new Date('2026-03-30T10:30:00'),
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop'
  },
  {
    id: '2',
    content: 'Compartiendo mi último diseño arquitectónico 🏗️ Un proyecto de vivienda sostenible con materiales ecológicos. La arquitectura verde es el futuro!',
    author: MOCK_USERS[1],
    career: MOCK_USERS[1].career,
    likes: 45,
    createdAt: new Date('2026-03-29T15:20:00'),
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop'
  },
  {
    id: '3',
    content: '¿Alguien más emocionado por las prácticas clínicas? 🏥 Estoy aprendiendo tanto cada día. La medicina es una carrera hermosa pero desafiante.',
    author: MOCK_USERS[2],
    career: MOCK_USERS[2].career,
    likes: 32,
    createdAt: new Date('2026-03-29T09:15:00'),
  },
  {
    id: '4',
    content: 'Acabo de lanzar mi primer emprendimiento digital! 🚀 Una plataforma para conectar emprendedores bolivianos. Si alguien quiere colaborar, escríbanme.',
    author: MOCK_USERS[3],
    career: MOCK_USERS[3].career,
    likes: 67,
    createdAt: new Date('2026-03-28T18:45:00'),
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
  },
  {
    id: '5',
    content: 'Reflexión del día: La salud mental es tan importante como la física. Cuiden su bienestar emocional 💚 #PsicologíaUCB',
    author: MOCK_USERS[4],
    career: MOCK_USERS[4].career,
    likes: 89,
    createdAt: new Date('2026-03-28T14:30:00'),
  },
  {
    id: '6',
    content: 'Gran debate en clase de Derecho Constitucional hoy! ⚖️ Es increíble cómo diferentes perspectivas enriquecen el análisis jurídico.',
    author: MOCK_USERS[5],
    career: MOCK_USERS[5].career,
    likes: 28,
    createdAt: new Date('2026-03-27T16:00:00'),
  },
  {
    id: '7',
    content: '📸 Trabajando en un reportaje sobre la cultura boliviana para mi proyecto final. ¡Me encanta contar historias a través de las imágenes!',
    author: MOCK_USERS[6],
    career: MOCK_USERS[6].career,
    likes: 51,
    createdAt: new Date('2026-03-27T11:20:00'),
    imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop'
  },
  {
    id: '8',
    content: 'Visitando obras de construcción para mi clase de Estructuras. La ingeniería civil es fascinante cuando la ves en acción! 👷‍♂️',
    author: MOCK_USERS[7],
    career: MOCK_USERS[7].career,
    likes: 19,
    createdAt: new Date('2026-03-26T13:40:00'),
  },
  {
    id: '9',
    content: 'Preparándome para el examen de Auditoría 📊 ¿Alguien de Contaduría quiere formar un grupo de estudio?',
    author: MOCK_USERS[8],
    career: MOCK_USERS[8].career,
    likes: 15,
    createdAt: new Date('2026-03-26T08:30:00'),
  },
  {
    id: '10',
    content: 'Implementando metodología Six Sigma en mi proyecto de optimización 📈 La ingeniería industrial tiene un impacto real en las empresas!',
    author: MOCK_USERS[9],
    career: MOCK_USERS[9].career,
    likes: 22,
    createdAt: new Date('2026-03-25T17:10:00'),
  }
];

// Comentarios mock mejorados
export const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    postId: '1',
    content: '¡Felicidades María! Me encantaría leer tu tesis cuando esté disponible.',
    author: MOCK_USERS[3],
    createdAt: new Date('2026-03-30T11:00:00')
  },
  {
    id: '2',
    postId: '1',
    content: 'Yo también estoy trabajando en IA, pero aplicado a finanzas. Deberíamos intercambiar ideas!',
    author: MOCK_USERS[9],
    createdAt: new Date('2026-03-30T12:15:00')
  },
  {
    id: '3',
    postId: '2',
    content: 'Hermoso diseño Carlos! La sostenibilidad es el camino 🌱',
    author: MOCK_USERS[0],
    createdAt: new Date('2026-03-29T16:00:00')
  },
  {
    id: '4',
    postId: '4',
    content: 'Qué genial Luis! Me interesa colaborar, te escribo al dm',
    author: MOCK_USERS[6],
    createdAt: new Date('2026-03-28T19:00:00')
  },
  {
    id: '5',
    postId: '5',
    content: 'Totalmente de acuerdo Sofia. El autocuidado es fundamental 💪',
    author: MOCK_USERS[2],
    createdAt: new Date('2026-03-28T15:00:00')
  }
];