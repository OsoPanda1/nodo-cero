export interface RDMArtist {
  id: string;
  name: string;
  discipline: string;
  location: string;
  bio: string;
  image: string;
  rating: number;
}

export interface RDMGastronomy {
  id: string;
  name: string;
  type: 'paste' | 'restaurante' | 'panaderia' | 'heladeria' | 'cafe';
  specialty: string;
  priceRange: string;
  location: string;
  image: string;
  rating: number;
  description: string;
}

export interface RDMTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  image: string;
}

export interface RDMPodcastEpisode {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  date: string;
  image: string;
  description: string;
  tags: string[];
}

export interface RDMBadge {
  id: string;
  name: string;
  icon: 'pickaxe' | 'paste' | 'mountain' | 'scroll' | 'globe' | 'star';
  description: string;
  rarity: 'Común' | 'Raro' | 'Épico' | 'Legendario';
}

export interface RDMChallenge {
  id: string;
  title: string;
  points: number;
  description: string;
  category: string;
  progress: number;
}

export interface RDMLegend {
  id: string;
  title: string;
  category: string;
  image: string;
  story: string;
  moral: string;
}

export interface RDMForumThread {
  id: string;
  title: string;
  author: string;
  role: string;
  category: string;
  replies: number;
  likes: number;
  time: string;
  excerpt: string;
  pinned?: boolean;
}

export interface RDMHonoree {
  id: string;
  name: string;
  title: string;
  achievement: string;
  image: string;
  year: string;
}

export interface RDMGalleryItem {
  id: string;
  image: string;
  caption: string;
  author: string;
  type: 'imagen' | 'video';
  category: string;
  likes: number;
}

export interface RDMTodoItem {
  id: string;
  title: string;
  icon: 'pickaxe' | 'paste' | 'mountain' | 'scroll' | 'globe' | 'star' | 'camera' | 'music';
}

export const RDM_ARTISTS: RDMArtist[] = [
  { id: 'art-anubis', name: 'Anubis Villaseñor', discipline: 'Orfebrería y Platería', location: 'Callejón de la Plata', bio: 'Maestro orfebre que forja plata ley .925 inspirada en la cristalografía del distrito minero. Sus piezas portan certificado criptográfico anti-falsificación.', image: '/images/pedro-romero.jpg', rating: 4.9 },
  { id: 'art-barro', name: 'Taller de Barro El Barretero', discipline: 'Cerámica y barro', location: 'Barrio de la Asunción', bio: 'Tres generaciones moldeando barro de la sierra: cazuelas, macetas y réplicas de las chimeneas de La Dificultad.', image: '/images/real-3.jpg', rating: 4.7 },
  { id: 'art-murales', name: 'Colectivo Pincel de Plata', discipline: 'Muralismo', location: 'Callejones del Centro', bio: 'Jóvenes muralistas que pintan la memoria minera: retratos de mineros, niñas pasteadoras y la niebla dorada del monte.', image: '/images/realito-arte.png', rating: 4.8 },
  { id: 'art-oyamel', name: 'Telar El Oyametl', discipline: 'Textil de lana', location: 'Purísima', bio: 'Telares de pedal que tejen cobijas y sarapes con lana de la Comarca y tintes naturales de la sierra.', image: '/images/real-4.jpg', rating: 4.6 },
  { id: 'art-niebla', name: 'Fotógrafos de la Niebla', discipline: 'Fotografía documental', location: 'Mirador Purísima', bio: 'Colectivo dedicado a capturar el atardecer, la niebla y la vida cotidiana del Real. Exponen en el Museo de la Dificultad.', image: '/images/mirador-purisima.jpg', rating: 4.9 },
  { id: 'art-retablos', name: 'Maestros del Retablo', discipline: 'Escultura en madera', location: 'Parroquia del Rosario', bio: 'Talladores de retablos y altares que restauran el patrimonio religioso de las capillas del Real.', image: '/images/rosario.jpg', rating: 4.8 },
];

export const RDM_GASTRONOMY: RDMGastronomy[] = [
  { id: 'g-pastes-real', name: 'Pastes El Real (El Más Antiguo)', type: 'paste', specialty: 'Paste de papa con carne, repulgue cornish', priceRange: '$30–$40', location: 'Centro', image: '/images/gastronomia-1.jpg', rating: 4.9, description: 'La pasteadora más antigua: masa artesanal, trenzado lateral y horno de piedra, receta heredada desde 1824.' },
  { id: 'g-pastes-mineros', name: 'Pastes Los Mineros', type: 'paste', specialty: 'Frijol, chile, plátano con machaca', priceRange: '$25–$35', location: 'Zona Minas', image: '/images/gastronomia-2.jpg', rating: 4.8, description: 'Pastes con sabor a socavón: recetas que los abuelos llevaban al interior de las minas.' },
  { id: 'g-pastes-dulce', name: 'Paste Dulce La Joyita', type: 'paste', specialty: 'Dulce de arroz con leche y pasas', priceRange: '$30–$40', location: 'Portal', image: '/images/gastronomia-3.jpg', rating: 4.7, description: 'El postre-paste: arroz con leche, piloncillo y canela horneados en la masa tradicional.' },
  { id: 'g-socavon', name: 'Restaurante El Socavón', type: 'restaurante', specialty: 'Mixiotes, barbacoa, chilacayotes', priceRange: '$150–$300', location: 'Zona Minas', image: '/images/gastronomia-4.jpg', rating: 4.5, description: 'Cocina de montaña con vista a las chimeneas de La Dificultad. Cocido hidalguense todos los fines de semana.' },
  { id: 'g-casona', name: 'Casona del Conde', type: 'restaurante', specialty: 'Cocina novomexicana con toque británico', priceRange: '$200–$400', location: 'Centro Histórico', image: '/images/centro.jpg', rating: 4.6, description: 'Menú de autor que mezcla mole y té de la tarde estilo Cornualles en una casona del siglo XVIII.' },
  { id: 'g-horno', name: 'Panadería El Horno del Real', type: 'panaderia', specialty: 'Pan de pulque, coyitas, pambazos', priceRange: '$10–$30', location: 'Centro', image: '/images/gastronomia-5.jpg', rating: 4.7, description: 'Hornos de piedra centenarios. El pan de pulque sale caliente a las 6:00 am.' },
  { id: 'g-luna', name: 'Helados y Esquimos La Luna', type: 'heladeria', specialty: 'Esquimos de leche quemada y guayaba', priceRange: '$25–$50', location: 'Plaza', image: '/images/plaza-principal.jpg', rating: 4.6, description: 'Los esquimos más famosos del Real: leche quemada, guayaba con queso y piloncillo.' },
  { id: 'g-altura', name: 'Café de Altura El Hiloche', type: 'cafe', specialty: 'Café de la Sierra de Hidalgo', priceRange: '$40–$70', location: 'Barrio Alto', image: '/images/ecoturismo.jpg', rating: 4.8, description: 'Tueste en el Real, café de 2,400 msnm. Ideal contra el frío del altiplano, con vistas al bosque.' },
];

export const RDM_TRACKS: RDMTrack[] = [
  { id: 't-1', title: 'Hijos de la Sierra', artist: 'Banda de Viento Hidalgo', genre: 'Música de viento', duration: '3:42', image: '/images/realito-cultura.png' },
  { id: 't-2', title: 'Marcha de los Mineros', artist: 'Estudiantina del Real', genre: 'Estudiantina', duration: '4:10', image: '/images/plaza-principal.jpg' },
  { id: 't-3', title: 'Polka de la Niebla', artist: 'Ensemble Cornish RDM', genre: 'Polka cornish', duration: '2:58', image: '/images/pueblo.jpg' },
  { id: 't-4', title: 'El Repulgue', artist: 'Son Huasteco del Monte', genre: 'Son huasteco', duration: '3:25', image: '/images/gastronomia-1.jpg' },
  { id: 't-5', title: 'Caminos de Plata', artist: 'Mariachi Real de Minas', genre: 'Mariachi', duration: '3:50', image: '/images/monumento-minero.jpg' },
  { id: 't-6', title: 'El Socavón Sonoro', artist: 'Mina Sonora', genre: 'Electrónica ambiental', duration: '5:12', image: '/images/ladificultad.jpg' },
  { id: 't-7', title: 'Corrido del Panteón Inglés', artist: 'Los Mineros del Viento', genre: 'Corrido', duration: '4:05', image: '/images/real-1.jpg' },
  { id: 't-8', title: 'Atardecer en la Purísima', artist: 'Jazz de la Niebla', genre: 'Jazz', duration: '6:20', image: '/images/mirador-purisima.jpg' },
];

export const RDM_PODCAST: RDMPodcastEpisode[] = [
  { id: 'p-1', title: 'La Huelga de 1766', subtitle: 'La primera huelga de América nació aquí', duration: '28 min', date: '12 Ene 2026', image: '/images/monumento-minero.jpg', description: 'Cronología del levantamiento de los mineros de la Mina de Dolores y su impacto mundial en los derechos laborales.', tags: ['Historia', 'Minas'] },
  { id: 'p-2', title: 'La receta secreta del paste', subtitle: 'Conversación con una pasteadora de 82 años', duration: '35 min', date: '29 Ene 2026', image: '/images/gastronomia-1.jpg', description: 'Doña Chole revela el repulgue perfecto, el punto de la masa y por qué el paste se trenza de lado.', tags: ['Gastronomía', 'Tradición'] },
  { id: 'p-3', title: 'El Panteón Inglés y sus leyendas', subtitle: '634 tumbas que miran hacia Inglaterra', duration: '41 min', date: '14 Feb 2026', image: '/images/real-1.jpg', description: 'Los fantasmas, el payaso y las historias reales de la comunidad cornish enterrada en el Real.', tags: ['Leyendas', 'Cornish'] },
  { id: 'p-4', title: 'Isabella y el Gemelo Digital', subtitle: 'Cómo una IA cuida el territorio', duration: '22 min', date: '01 Mar 2026', image: '/images/hero.png', description: 'El equipo explica la Heptafederación YUN, los 7 núcleos y el gemelo digital 2D/3D del Real.', tags: ['Tecnología', 'YUN'] },
  { id: 'p-5', title: 'Post-cuántica para el pueblo', subtitle: '¿Qué significa blindar un municipio?', duration: '26 min', date: '18 Mar 2026', image: '/images/realito-arte.png', description: 'De Dilithium a Falcon: la criptografía del futuro al servicio de la soberanía territorial.', tags: ['Seguridad', 'Futuro'] },
  { id: 'p-6', title: 'Peñas Cargadas: el bosque que cuenta', subtitle: 'Senderos, mitos y reforestación', duration: '31 min', date: '04 Abr 2026', image: '/images/penas-cargadas.jpg', description: 'Las formaciones rocosas, los manantiales y las jornadas de conservación con la comunidad.', tags: ['Naturaleza', 'Comunidad'] },
];

export const RDM_BADGES: RDMBadge[] = [
  { id: 'b-1', name: 'Guardián Minero', icon: 'pickaxe', description: 'Visita la Mina de Acosta y su socavón.', rarity: 'Común' },
  { id: 'b-2', name: 'Maestro del Trenzado', icon: 'paste', description: 'Prueba pastes en 5 pasteadoras distintas.', rarity: 'Raro' },
  { id: 'b-3', name: 'Explorador de Peñas', icon: 'mountain', description: 'Completa el sendero de Peñas Cargadas.', rarity: 'Raro' },
  { id: 'b-4', name: 'Cronista Cornish', icon: 'scroll', description: 'Conoce la historia de los 44 mineros ingleses de 1824.', rarity: 'Épico' },
  { id: 'b-5', name: 'Embajador del Monte', icon: 'globe', description: 'Comparte 5 experiencias en la galería comunitaria.', rarity: 'Épico' },
  { id: 'b-6', name: 'Leyenda del Real', icon: 'star', description: 'Completa los 7 núcleos del pasaporte YUN.', rarity: 'Legendario' },
];

export const RDM_CHALLENGES: RDMChallenge[] = [
  { id: 'c-1', title: 'La Ruta de la Plata', points: 500, description: 'Visita las 4 minas históricas: Acosta, Dificultad, Dolores y Museo de Medicina.', category: 'Minas', progress: 75 },
  { id: 'c-2', title: 'Cata de Pastes', points: 300, description: 'Prueba pastes de papa con carne, frijol, chile y dulce en un solo día.', category: 'Gastronomía', progress: 100 },
  { id: 'c-3', title: 'Atardecer Soberano', points: 200, description: 'Fotografía el atardecer desde el Mirador Purísima y compártelo en la galería.', category: 'Naturaleza', progress: 40 },
  { id: 'c-4', title: 'Legado Cornish', points: 350, description: 'Recorre el Panteón Inglés y cuenta la leyenda del payaso Richard Bell.', category: 'Cultura', progress: 60 },
  { id: 'c-5', title: 'Embajador Verde', points: 250, description: 'Participa en la reforestación de Peñas Cargadas o El Hiloche.', category: 'Comunidad', progress: 10 },
  { id: 'c-6', title: 'Cronista del Foro', points: 150, description: 'Publica tu primera historia de familia minera en el Foro RDM.', category: 'Comunidad', progress: 0 },
];

export const RDM_LEGENDS: RDMLegend[] = [
  { id: 'l-1', title: 'El Tío de la Mina', category: 'Minería', image: '/images/ladificultad.jpg', story: 'Los mineros del Real contaban que dentro de la tierra vive "El Tío", el guardián del subsuelo que cuida las vetas. Antes de entrar al socavón, se le deja ofrenda de tabaco y pulque para pedir permiso y protección. Quien olvida al Tío, corre el riesgo de que se cierre la veta.', moral: 'El respeto a la tierra es respeto al trabajo.' },
  { id: 'l-2', title: 'El Payaso del Panteón Inglés', category: 'Leyenda', image: '/images/real-1.jpg', story: 'Cuentan que un payaso llamado Richard Bell fue enterrado en el Panteón Inglés y que su fantasma vaga entre las tumbas haciendo malabares con una pelota de plata. Los vecinos juran haberlo visto las noches de niebla, y por eso se le dejan flores blancas que apuntan hacia Inglaterra.', moral: 'Hasta los muertos extrañan su tierra.' },
  { id: 'l-3', title: 'El Duende del Callejón', category: 'Callejones', image: '/images/callejon.jpg', story: 'En el callejón del Zopilote, un duende vestido de minero aparece a los viajeros que caminan de noche. Solo quien le ofrece un paste de frijol continúa su camino seguro; el que se ríe de él, pierde el rumbo hasta el amanecer.', moral: 'En el Real, la cortesía siempre abre puertas.' },
  { id: 'l-4', title: 'La Niebla del Mirador', category: 'Naturaleza', image: '/images/mirador-purisima.jpg', story: 'Dicen que la Purísima se viste de niebla cuando llora a los mineros que no volvieron. Por eso el atardecer es sagrado: es el momento en que las almas de los socavones suben al mirador a despedir el día.', moral: 'La memoria vive en los paisajes.' },
  { id: 'l-5', title: 'El Cristo que Protege el Pueblo', category: 'Fe', image: '/images/zelotla.jpg', story: 'El Cristo Rey de Zelontla vigila el Real desde la peña. En las fiestas de la Asunción, los mineros lo visten con casco y lámpara, y se dice que la noche de tormenta su brazo se extiende para cubrir a los que trabajan bajo tierra.', moral: 'La fe y el oficio van de la mano en el monte.' },
];

export const RDM_DICHOS_MINEROS = [
  { id: 'dm-1', text: '"Minero que no pita, no es minero."', meaning: 'La pitada (silbato) era la señal de identidad y de peligro en el socavón.' },
  { id: 'dm-2', text: '"Al tiro y a la pala, con la lámpara encendida."', meaning: 'Se trabaja con todo y a la vista: sin miedo y con preparación.' },
  { id: 'dm-3', text: '"El monte da, el monte quita."', meaning: 'La tierra regala la plata pero exige respeto y sacrificio.' },
  { id: 'dm-4', text: '"A buen minero, poca pala le sobra."', meaning: 'El oficio no está en la herramienta, sino en las manos del que la usa.' },
  { id: 'dm-5', text: '"El que baja al socavón, sube con memoria."', meaning: 'Todo minero vuelve a la superficie con una historia que contar.' },
  { id: 'dm-6', text: '"Plata por día, leyenda por vida."', meaning: 'El minero no solo extrae riqueza, construye la identidad del pueblo.' },
];

export const RDM_FORUM_THREADS: RDMForumThread[] = [
  { id: 'f-1', title: '¿Cuál es el mejor paste de Real del Monte? Debate definitivo', author: 'Don Beto', role: 'Cocinero local', category: 'Gastronomía', replies: 48, likes: 132, time: 'hace 2 h', excerpt: 'Todos defendemos nuestra pasteadora, pero las pruebas son claras: el repulgue de Los Mineros no se compara...', pinned: true },
  { id: 'f-2', title: 'Historia de mi abuelo minero en la Mina de Acosta', author: 'Mariana V.', role: 'Nieta de minero', category: 'Historias', replies: 27, likes: 210, time: 'hace 5 h', excerpt: 'Mi abuelo bajaba con una lámpara de carburo y un paste de frijol. Me enseñó que el respeto al Tío...' },
  { id: 'f-3', title: 'Feria del Paste 2026: propuestas de la comunidad', author: 'Colectivo Gastronómico', role: 'Organizador', category: 'Eventos', replies: 19, likes: 86, time: 'hace 1 d', excerpt: 'Proponemos un concurso de repulgue en vivo y una cata de pastes dulces...', pinned: true },
  { id: 'f-4', title: 'Cómo llegar desde CDMX en transporte público', author: 'Turista_Ana', role: 'Visitante', category: 'Turismo', replies: 33, likes: 74, time: 'hace 1 d', excerpt: 'ADO a Pachuca + urbano al Real. Comparto horarios y consejos para evitar la niebla...' },
  { id: 'f-5', title: 'Fotografías del Panteón Inglés al atardecer', author: 'Fotógrafos de la Niebla', role: 'Colectivo', category: 'Fotografía', replies: 15, likes: 168, time: 'hace 2 d', excerpt: 'Subimos nuestra última sesión con la luz dorada. ¡Compartan las suyas en la galería!', },
  { id: 'f-6', title: 'Voluntariado: reforestación en Peñas Cargadas', author: 'Embajadores del Monte', role: 'Voluntarios', category: 'Comunidad', replies: 22, likes: 95, time: 'hace 3 d', excerpt: 'Este sábado plantamos 400 oyameles. Necesitamos manos y botas...' },
];

export const RDM_HONOREES: RDMHonoree[] = [
  { id: 'h-1', name: 'Pedro Romero de Terreros', title: 'El Conde de Regla (1743)', achievement: 'Elevó el Real a la riqueza minera más grande de su época y financió la Marina Real española.', image: '/images/pedro-romero.jpg', year: 'Siglo XVIII' },
  { id: 'h-2', name: 'Los 44 Mineros de Cornualles', title: 'Ingenieros del vapor (1824)', achievement: 'Trajeron la revolución industrial: máquinas de vapor, el paste y el Panteón Inglés.', image: '/images/real-1.jpg', year: '1824' },
  { id: 'h-3', name: 'Mineros de la Mina de Dolores', title: 'Primera huelga de América', achievement: 'En 1766 se levantaron por sus derechos laborales, precedente mundial de la organización obrera.', image: '/images/monumento-minero.jpg', year: '1766' },
  { id: 'h-4', name: 'Doña Chole Aguilar', title: 'Pasteadora Maestra', achievement: '60 años horneando el paste perfecto; mentora de tres generaciones de pasteadoras.', image: '/images/gastronomia-1.jpg', year: '2025' },
  { id: 'h-5', name: 'Don Fidencio Cortés', title: 'Capataz de Mina', achievement: '41 años en el socavón de Acosta; cronista oral de los últimos días de la minería tradicional.', image: '/images/mina-acosta.jpg', year: '2024' },
  { id: 'h-6', name: 'Anubis Villaseñor', title: 'Arquitecto de la Heptafederación YUN', achievement: 'Fundador del RDM Digital Hub, diseñador del Nodo Cero y del gemelo digital del territorio.', image: '/images/hero.png', year: '2026' },
  { id: 'h-7', name: 'Embajadores del Monte', title: 'Voluntarios de la Comarca', achievement: '2,500 árboles plantados y 120 jornadas de conservación del patrimonio en 2025.', image: '/images/hiloche.jpg', year: '2025' },
  { id: 'h-8', name: 'Isabella Villaseñor AI', title: 'Núcleo de Decisión YUN-01', achievement: 'La primera asistente cognitiva del territorio: orienta, recomienda y protege la identidad del Real.', image: '/images/realito-cultura.png', year: '2026' },
];

export const RDM_GALLERY: RDMGalleryItem[] = [
  { id: 'g-1', image: '/images/mirador-purisima.jpg', caption: 'Atardecer desde la Purísima, niebla dorada', author: 'Fotógrafos de la Niebla', type: 'imagen', category: 'Naturaleza', likes: 214 },
  { id: 'g-2', image: '/images/pueblo.jpg', caption: 'El Real visto desde el camino a Pachuca', author: 'Mariana V.', type: 'imagen', category: 'Pueblo', likes: 156 },
  { id: 'g-3', image: '/images/gastronomia-1.jpg', caption: 'Pastes recién salidos del horno de piedra', author: 'Don Beto', type: 'imagen', category: 'Gastronomía', likes: 189 },
  { id: 'g-4', image: '/images/calles.jpg', caption: 'Callejones empedrados tras la lluvia', author: 'Ana Turista', type: 'imagen', category: 'Pueblo', likes: 143 },
  { id: 'g-5', image: '/images/ladificultad.jpg', caption: 'Las chimeneas de La Dificultad al mediodía', author: 'Colectivo Pincel', type: 'imagen', category: 'Minas', likes: 178 },
  { id: 'g-6', image: '/images/penas-cargadas.jpg', caption: 'Rocas de Peñas Cargadas entre oyameles', author: 'Senderista_RDM', type: 'imagen', category: 'Naturaleza', likes: 131 },
  { id: 'g-7', image: '/images/real-1.jpg', caption: 'El Panteón Inglés en la niebla matutina', author: 'Cronista Cornish', type: 'imagen', category: 'Cultura', likes: 245 },
  { id: 'g-8', image: '/images/plaza-principal.jpg', caption: 'Vida de plaza un domingo por la mañana', author: 'Don Beto', type: 'video', category: 'Pueblo', likes: 97 },
  { id: 'g-9', image: '/images/realito-minas.png', caption: 'Video: recorrido guiado por la Mina de Acosta', author: 'Patronato Minero', type: 'video', category: 'Minas', likes: 320 },
  { id: 'g-10', image: '/images/rosario.jpg', caption: 'La Parroquia del Rosario iluminada', author: 'Mariana V.', type: 'imagen', category: 'Cultura', likes: 167 },
  { id: 'g-11', image: '/images/hiloche.jpg', caption: 'El Hiloche: el bosque que respira', author: 'Embajadores del Monte', type: 'imagen', category: 'Naturaleza', likes: 119 },
  { id: 'g-12', image: '/images/zelotla.jpg', caption: 'El Cristo de Zelontla vigilando el valle', author: 'Ana Turista', type: 'imagen', category: 'Cultura', likes: 154 },
];

export const RDM_TEAM = [
  { id: 'team-1', name: 'Edwin Oswaldo Castillo Trejo', role: 'Fundador · Arquitecto de la Heptafederación YUN', alias: 'Anubis Villaseñor', bio: 'Visionario de la soberanía territorial digital. Diseñó el Nodo Cero y el gemelo digital de Real del Monte.', image: '/images/hero.png' },
  { id: 'team-2', name: 'Isabella Villaseñor AI', role: 'Núcleo de Decisión · Asistente Cognitiva', alias: 'YUN-01', bio: 'Inteligencia artificial del territorio: orienta turistas, custodia la historia y responde en tiempo real.', image: '/images/realito-cultura.png' },
  { id: 'team-3', name: 'Consejo de la Comarca', role: 'Gobernanza comunitaria de los 7 núcleos', alias: 'Ciudadanía Digital', bio: 'Pasteadoras, mineros, artesanos, jóvenes y autoridades locales que alimentan los datos del territorio.', image: '/images/pueblo.jpg' },
  { id: 'team-4', name: 'Patronato Minero RDM', role: 'Custodia del patrimonio histórico', alias: 'Minas & Socavones', bio: 'Guías certificados y conservadores de la Mina de Acosta, La Dificultad y el Panteón Inglés.', image: '/images/mina-acosta.jpg' },
];

export const RDM_VALUES = [
  { id: 'v-1', title: 'Soberanía', description: 'Los datos y la identidad del territorio pertenecen a su gente, no a corporaciones.' },
  { id: 'v-2', title: 'Memoria', description: 'Honramos a mineros, pasteadoras y cronistas que construyeron el Real.' },
  { id: 'v-3', title: 'Innovación', description: 'Gemelo digital, IA y criptografía post-cuántica al servicio del pueblo.' },
  { id: 'v-4', title: 'Comunidad', description: 'Foro, muro de honor y galería compartida: el Real es de quienes lo habitan.' },
];
