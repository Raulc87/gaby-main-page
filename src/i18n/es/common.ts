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
        'Mentoría financiera para ejecutivos y profesionales corporativos: ordená tu dinero, convertí los beneficios de tu carrera en capital e invertí para construir patrimonio.',
    },
    story: {
      title: 'Mi historia — Gaby Kelly',
      description:
        'Del mundo corporativo a mi libertad: la historia de Gaby Kelly.',
    },
    vip: {
      title: 'Aplicá a Wealth Mastery — Gaby Kelly',
      description:
        'Aplicá para trabajar directamente con Gaby y agendá tu llamada inicial sin costo.',
    },
    mastery: {
      title: 'Wealth Mastery — Gaby Kelly',
      description:
        'Mentoría individual para ejecutivos y profesionales del mundo corporativo: convertí tu salario en patrimonio con el Método Polaris.',
    },
    privacy: {
      title: 'Aviso de privacidad — Gaby Kelly',
      description: 'Cómo tratamos tus datos personales según la Ley 8968.',
    },
    calculator: {
      title: '¿Cuántos meses podrías sostenerte? — Gaby Kelly',
      description:
        'Diagnóstico gratis en 3 minutos: descubrí cuánto tiempo te da hoy tu dinero sin tu salario.',
    },
    method: {
      title: 'Método Polaris — Gaby Kelly',
      description:
        'Los tres pasos del Método Polaris para que tu salario trabaje para vos.',
    },
  },
  nav: {
    brand: 'Gaby Kelly',
    story: 'Mi historia',
    mastery: 'Wealth Mastery',
    diagnosis: 'Diagnóstico gratis',
    vip: 'Aplicá a Wealth Mastery',
    vip_short: 'Aplicá',
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
    vip_long: 'Trabajá directamente con Gaby · Wealth Mastery',
    vip_apply: 'Aplicá a Wealth Mastery',
    read_story: 'Leé mi historia completa',
  },
  vip_band: {
    eyebrow: 'Mentoría Wealth Mastery',
    title: '¿Querés trabajar *directamente conmigo*?',
    body:
      'Imaginá saber exactamente con cuánto contás, tener tu dinero trabajando a tu favor y decidir sobre tu carrera desde la libertad, no desde la necesidad. Y, cuando estés con tu familia, estar ahí de verdad. Llená una breve aplicación y agendá tu llamada inicial.',
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
