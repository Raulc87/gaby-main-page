// My story page copy (docs/ux/CONTENT.md section 6), copied verbatim by key:
// `story.media.label` is `story.media.label` here. `*text*` marks the italic
// emphasis of a heading. `story.resources_link` is `cta.start_free` (common.ts).
// Changing copy means changing CONTENT.md first.
export interface StoryContent {
  eyebrow: string;
  title: string;
  p1: string;
  p2: string;
  p3: string;
  media: { label: string; '1': string; '2': string; '3': string; '4': string };
  experience: {
    label: string;
    logo_alt: { microsoft: string; oracle: string };
    intel: string;
  };
  bio: { placeholder: string };
  photo: { placeholder: string };
}

export const story: StoryContent = {
  eyebrow: 'Mi historia',
  title: 'Del mundo corporativo *a mi libertad.*',
  p1: 'Trabajé 18 años en el mundo corporativo como gerente de ventas de canales de distribución, con partners de Intel, Microsoft y Oracle. Cuotas cada vez más altas, viajes, buenos beneficios.',
  p2: 'Era mamá sola, y por subir la escalera sacrifiqué mucho tiempo con mi hija. Estaba presente en cuerpo, pero mi cabeza seguía en el trabajo. Y me di cuenta tarde de la oportunidad que tenía en las manos para construir otra cosa.',
  p3: 'Hoy, después de más de 10 años construyendo mi portafolio junto a asesores especializados, acompaño a ejecutivos y profesionales corporativos a convertir un buen salario en patrimonio, sin esperar tanto como yo.',
  media: {
    label: 'Me han entrevistado en',
    '1': 'Canal 13',
    '2': 'Radio Azul',
    '3': 'Radio Fides',
    '4': 'Charlas',
  },
  experience: {
    label: 'Experiencia corporativa',
    logo_alt: { microsoft: 'Microsoft', oracle: 'Oracle' },
    intel: 'Intel',
  },
  bio: { placeholder: 'Biografía y credenciales' },
  photo: { placeholder: 'Fotos de la sesión' },
};
