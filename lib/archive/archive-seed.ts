/* ================================================================== */
/* ARCHIVO HISTÓRICO — Datos semilla del catálogo                      */
/* ================================================================== */
/* Colecciones iniciales recomendadas del Archivo y piezas publicadas  */
/* de ejemplo. Solo se cargan si el almacén está vacío.                */
/* ================================================================== */

import type { ArchiveCollection, ArchiveItem, ArchiveFileRecord } from './archive-types';

const U = (seed: number): string => {
  const hex = seed.toString(16).padStart(24, '0');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(12, 15)}-a${hex.slice(15, 18)}-${hex.slice(18)}`;
};

const SHA = (seed: number): string => `sha256:${seed.toString(16).padStart(64, '0')}`;

export const ARCHIVE_SEED_COLLECTIONS: ArchiveCollection[] = [
  { id: U(1), slug: 'memoria-minera', title: 'Memoria minera y trabajo', description: 'Minas, talleres, oficios, herramientas, sindicatos y familias mineras del Real.', coverImagePath: '/images/monumento-minero.jpg', isPublic: true, createdAt: 1, updatedAt: 1 },
  { id: U(2), slug: 'real-del-monte-en-imagenes', title: 'Real del Monte en imágenes', description: 'Calles, casas, plazas, arquitectura y transformaciones urbanas del pueblo mágico.', coverImagePath: '/images/pueblo.jpg', isPublic: true, createdAt: 1, updatedAt: 1 },
  { id: U(3), slug: 'mapas-y-territorio', title: 'Mapas y territorio', description: 'Planos, croquis, rutas, minería y paisaje de la Comarca Minera.', coverImagePath: '/images/mirador-purisima.jpg', isPublic: true, createdAt: 1, updatedAt: 1 },
  { id: U(4), slug: 'prensa-y-vida-publica', title: 'Prensa y vida pública', description: 'Periódicos, carteles, programas, invitaciones y avisos de la vida del pueblo.', coverImagePath: '/images/plaza-principal.jpg', isPublic: true, createdAt: 1, updatedAt: 1 },
  { id: U(5), slug: 'memoria-oral', title: 'Memoria oral', description: 'Entrevistas con consentimiento, transcripción y fragmentos públicos.', coverImagePath: '/images/real-1.jpg', isPublic: true, createdAt: 1, updatedAt: 1 },
  { id: U(6), slug: 'fiestas-tradiciones-y-comunidad', title: 'Fiestas, tradiciones y comunidad', description: 'Gastronomía, deporte, celebraciones, escuelas y asociaciones.', coverImagePath: '/images/gastronomia-1.jpg', isPublic: true, createdAt: 1, updatedAt: 1 },
  { id: U(7), slug: 'colecciones-familiares', title: 'Colecciones familiares', description: 'Donaciones digitalizadas con atribución y reglas claras.', coverImagePath: '/images/rosario.jpg', isPublic: true, createdAt: 1, updatedAt: 1 },
];

export const ARCHIVE_SEED_ITEMS: ArchiveItem[] = [
  {
    id: U(101), collectionId: U(1), slug: 'huelga-mina-dolores-1766',
    title: 'La huelga de la Mina de Dolores (1766)',
    summary: 'Levantamiento de los mineros del Real por el respeto de sus derechos laborales, precedente mundial de la organización obrera.',
    description: 'Cronología del movimiento de 1766 en la Mina de Dolores, el reparto de la plata y las peticiones de los trabajadores ante la corona.',
    assetType: 'document', status: 'published', accessLevel: 'open', rightsStatus: 'public_domain',
    authorOrSource: 'Archivo General de la Nación', sourceReference: 'AGN, Minería, vol. 168', donorName: null,
    license: 'Dominio público', historicalDateStart: '1766-07-15', historicalDateEnd: '1766-08-20',
    datePrecision: 'exact', locationName: 'Mina de Dolores, Real del Monte', latitude: 20.1414, longitude: -98.6747,
    people: ['Comunidad minera del Real'], organizations: ['Mina de Dolores'], tags: ['huelga', '1766', 'derechos laborales', 'minería'],
    publishedAt: 1, withdrawnAt: null, withdrawnReason: null, createdAt: 1, updatedAt: 1,
  },
  {
    id: U(102), collectionId: U(1), slug: 'socavon-acosta-1980',
    title: 'El socavón de la Mina de Acosta en 1980',
    summary: 'Fotografía del interior del socavón de Acosta durante los últimos años de la minería tradicional con lámpara de carburo.',
    description: 'Serie fotográfica del trabajo al interior del socavón: barrenadores, güiros y el transporte de mineral por vagonetas.',
    assetType: 'photograph', status: 'published', accessLevel: 'view_only', rightsStatus: 'permission_granted',
    authorOrSource: 'Fotógrafos de la Niebla', sourceReference: 'Colección oral de la Comarca', donorName: 'Don Fidencio Cortés',
    license: 'Uso cultural no comercial', historicalDateStart: '1980-01-01', historicalDateEnd: null,
    datePrecision: 'year', locationName: 'Mina de Acosta, Real del Monte', latitude: 20.1442, longitude: -98.6725,
    people: ['Minero anónimo'], organizations: ['Mina de Acosta'], tags: ['socavón', 'lámpara de carburo', 'minería'],
    publishedAt: 1, withdrawnAt: null, withdrawnReason: null, createdAt: 1, updatedAt: 1,
  },
  {
    id: U(103), collectionId: U(2), slug: 'callejon-zopilote-1908',
    title: 'El callejón del Zopilote a principios del siglo XX',
    summary: 'Vista del callejón empedrado con casas de dos aguas y la niebla típica del altiplano.',
    description: 'Tarjeta postal de la primera década del siglo XX que muestra la arquitectura del centro histórico.',
    assetType: 'photograph', status: 'published', accessLevel: 'open', rightsStatus: 'public_domain',
    authorOrSource: 'Colección postal del Real', sourceReference: 'Serie postales 1900-1910', donorName: null,
    license: 'Dominio público', historicalDateStart: '1908-01-01', historicalDateEnd: null,
    datePrecision: 'circa', locationName: 'Callejón del Zopilote', latitude: 20.1385, longitude: -98.6761,
    people: [], organizations: [], tags: ['calles', 'callejones', 'postal', 'arquitectura'],
    publishedAt: 1, withdrawnAt: null, withdrawnReason: null, createdAt: 1, updatedAt: 1,
  },
  {
    id: U(104), collectionId: U(3), slug: 'plano-minas-1824',
    title: 'Plano de las minas de Real del Monte (1824)',
    summary: 'Plano histórico de las pertenencias mineras de la Real del Monte Company of Adventurers.',
    description: 'Plano litografiado de 1824 con la ubicación de Acosta, La Dificultad, Dolores y las haciendas de beneficio.',
    assetType: 'map', status: 'published', accessLevel: 'open', rightsStatus: 'public_domain',
    authorOrSource: 'Real del Monte Company', sourceReference: 'Mapoteca nacional, RDM-1824', donorName: null,
    license: 'Dominio público', historicalDateStart: '1824-01-01', historicalDateEnd: null,
    datePrecision: 'year', locationName: 'Real del Monte', latitude: 20.1408, longitude: -98.6742,
    people: [], organizations: ['Real del Monte Company'], tags: ['plano', 'minas', '1824', 'territorio'],
    publishedAt: 1, withdrawnAt: null, withdrawnReason: null, createdAt: 1, updatedAt: 1,
  },
  {
    id: U(105), collectionId: U(5), slug: 'entrevista-dona-chole',
    title: 'Memoria oral: Doña Chole y el secreto del repulgue',
    summary: 'Fragmento público de la entrevista a Doña Chole Aguilar, pasteadora maestra de 82 años.',
    description: 'Audio de 8 minutos donde Doña Chole narra cómo se trenza el paste de lado, el punto de la masa y los hornos de piedra.',
    assetType: 'oral_history', status: 'published', accessLevel: 'open', rightsStatus: 'permission_granted',
    authorOrSource: 'Proyecto Memoria Oral RDM', sourceReference: 'PMO-005', donorName: 'Doña Chole Aguilar',
    license: 'Uso cultural no comercial', historicalDateStart: '2026-01-29', historicalDateEnd: null,
    datePrecision: 'exact', locationName: 'Real del Monte', latitude: 20.139, longitude: -98.6755,
    people: ['Chole Aguilar'], organizations: ['Proyecto Memoria Oral RDM'], tags: ['memoria oral', 'pastes', 'gastronomía'],
    publishedAt: 1, withdrawnAt: null, withdrawnReason: null, createdAt: 1, updatedAt: 1,
  },
  {
    id: U(106), collectionId: U(6), slug: 'feria-paste-1927',
    title: 'Programa de la primera Feria del Paste (1927)',
    summary: 'Invitación y programa de la celebración que reunió a las pasteadoras de la Comarca por primera vez.',
    description: 'Documento facsimilar del programa: concurso de repulgue, música de viento y reparto de pastes.',
    assetType: 'newspaper', status: 'published', accessLevel: 'open', rightsStatus: 'public_domain',
    authorOrSource: 'Hemeroteca de la Comarca', sourceReference: 'RDM-Prensa-1927', donorName: null,
    license: 'Dominio público', historicalDateStart: '1927-10-20', historicalDateEnd: null,
    datePrecision: 'exact', locationName: 'Plaza Principal', latitude: 20.1392, longitude: -98.6752,
    people: [], organizations: ['Comité de la Feria'], tags: ['feria del paste', '1927', 'programa', 'fiestas'],
    publishedAt: 1, withdrawnAt: null, withdrawnReason: null, createdAt: 1, updatedAt: 1,
  },
];

/** Derivados públicos de ejemplo para las piezas semilla. */
export const ARCHIVE_SEED_FILES: ArchiveFileRecord[] = [
  { id: U(201), itemId: U(101), storageBucket: 'archive-public', objectPath: 'memoria-minera/huelga-1766/cronologia.pdf', fileRole: 'access_copy', mimeType: 'application/pdf', byteSize: 1_024_512, sha256: SHA(201), width: null, height: null, durationSeconds: null, isPublic: true, createdAt: 1 },
  { id: U(202), itemId: U(102), storageBucket: 'archive-public', objectPath: 'memoria-minera/acosta-1980/socavon.webp', fileRole: 'thumbnail', mimeType: 'image/webp', byteSize: 512_000, sha256: SHA(202), width: 800, height: 600, durationSeconds: null, isPublic: true, createdAt: 1 },
  { id: U(203), itemId: U(103), storageBucket: 'archive-public', objectPath: 'imagenes/callejon-1908/postal.webp', fileRole: 'access_copy', mimeType: 'image/webp', byteSize: 384_000, sha256: SHA(203), width: 1200, height: 800, durationSeconds: null, isPublic: true, createdAt: 1 },
  { id: U(204), itemId: U(104), storageBucket: 'archive-public', objectPath: 'mapas/plano-1824/plano.webp', fileRole: 'access_copy', mimeType: 'image/webp', byteSize: 2_048_000, sha256: SHA(204), width: 1600, height: 1200, durationSeconds: null, isPublic: true, createdAt: 1 },
  { id: U(205), itemId: U(105), storageBucket: 'archive-public', objectPath: 'memoria-oral/chole/repulgue.mp3', fileRole: 'access_copy', mimeType: 'audio/mpeg', byteSize: 7_680_000, sha256: SHA(205), width: null, height: null, durationSeconds: 480, isPublic: true, createdAt: 1 },
  { id: U(206), itemId: U(106), storageBucket: 'archive-public', objectPath: 'fiestas/feria-1927/programa.pdf', fileRole: 'access_copy', mimeType: 'application/pdf', byteSize: 768_000, sha256: SHA(206), width: null, height: null, durationSeconds: null, isPublic: true, createdAt: 1 },
];
