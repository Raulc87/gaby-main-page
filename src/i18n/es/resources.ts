// Resource card labels and topic names (ES), docs/ux/CONTENT.md sections 7.1-7.2,
// copied verbatim. The keys mirror CONTENT.md (`resource.type.guide`,
// `resources.topic.debt`, ...). The page-level strings (eyebrow, title, filters)
// come with GK-024-resource-library.
import type { ResourcesDictionary } from '../../lib/lead/types';

export const resources: ResourcesDictionary = {
  resource: {
    type: {
      minicourse: 'Minicurso',
      guide: 'Guía',
      template: 'Plantilla',
      checklist: 'Checklist',
      class: 'Clase grabada',
    },
    free: 'gratis',
    access: { download: 'Descarga libre', email: 'Con tu correo' },
    cta: {
      download: 'Descargar gratis',
      guide: 'Recibir la guía',
      class: 'Ver la clase',
      minicourse: 'Quiero el minicurso',
    },
    pending: 'Disponible pronto',
    email: { coming_soon: 'La entrega por correo estará disponible pronto.' },
    cover_alt: 'Portada de {title}',
  },
  resources: {
    topic: {
      debt: 'Salir de deudas',
      wallets: 'Billeteras y presupuesto',
      investing: 'Inversión',
      mindset: 'Mentalidad y dinero',
    },
  },
};
