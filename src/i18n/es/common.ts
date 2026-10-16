// Shared strings: header, footer, calls to action, VIP band, per-page metadata,
// preview marker and the pending badge label (docs/ux/CONTENT.md sections 1-4,
// 8.6 and 10). Copied verbatim by key; `*text*` marks the italic emphasis of a
// heading and is parsed at render time. Changing copy means changing CONTENT.md
// first. `nav.blog` is added with US-026.
import type { CommonContent } from '../index';

export const common: CommonContent = {
  meta: {
    site_name: 'Gaby Kelly',
    home: {
      title:
        'Gaby Kelly — Del mundo corporativo a tu libertad financiera',
      description:
        'Mentoría financiera para ejecutivos y profesionales de transnacionales: ordena tu dinero, aprovecha los beneficios de tu carrera e invierte para construir patrimonio.',
    },
    story: {
      title: 'Mi historia — Gaby Kelly',
      description:
        'Del mundo corporativo a mi libertad: la historia de Gaby Kelly.',
    },
    resources: {
      title: 'Recursos gratis — Gaby Kelly',
      description:
        'Guías, plantillas y minicursos gratuitos para ordenar, invertir y crecer.',
    },
    vip: {
      title: 'Mentoría VIP · Wealth Mastery — Gaby Kelly',
      description:
        'Aplica para trabajar directamente con Gaby y agenda tu llamada inicial sin costo.',
    },
    privacy: {
      title: 'Aviso de privacidad — Gaby Kelly',
      description: 'Cómo tratamos tus datos personales según la Ley 8968.',
    },
  },
  nav: {
    brand: 'Gaby Kelly',
    story: 'Mi historia',
    method: 'Método Polaris',
    resources: 'Recursos gratis',
    vip: 'Mentoría VIP',
    menu_open: 'Abrir menú',
    menu_close: 'Cerrar menú',
    label: 'Navegación principal',
  },
  lang: {
    toggle_label: 'Cambiar idioma',
  },
  skip_link: 'Saltar al contenido',
  footer: {
    brand: 'Gaby Kelly',
    concept: 'Del mundo corporativo a tu libertad financiera.',
    disclaimer:
      'Gaby Kelly es inversora y mentora; no es asesora financiera. El contenido es educativo y no constituye una recomendación de inversión.',
    data_note: 'Tus datos protegidos según la Ley 8968.',
    privacy_link: 'Aviso de privacidad',
  },
  cta: {
    vip_long: 'Trabaja directamente con Gaby · VIP',
    vip_apply: 'Aplicar a la Mentoría VIP',
    start_free: 'O empieza gratis con los recursos',
    all_resources: 'Ver la biblioteca completa',
    read_story: 'Lee mi historia completa',
  },
  vip_band: {
    eyebrow: 'Mentoría VIP · Wealth Mastery',
    title: '¿Quieres trabajar *directamente conmigo*?',
    body:
      'Imagina saber exactamente con cuánto cuentas, tener tu dinero trabajando a tu favor y decidir sobre tu carrera desde la libertad, no desde la necesidad. Y, cuando estés con tu familia, estar ahí de verdad. Llena una breve aplicación y agenda tu llamada inicial.',
    short_title:
      '¿Prefieres un plan hecho a tu medida? *Trabaja directamente con Gaby.*',
  },
  preview: {
    badge: 'Vista previa',
    banner:
      'Vista previa del sitio en construcción. Los formularios no envían ni guardan nada.',
    form_note: 'Esto es una demostración: no se envió ni se guardó nada.',
    scheduler: 'Aquí aparecerá el calendario para agendar la llamada.',
  },
  pending: {
    badge: 'Pendiente de validación',
  },
};
