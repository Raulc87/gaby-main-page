// Privacy notice (ES), docs/ux/CONTENT.md section 9, copied verbatim. DRAFT: requires
// legal review before public launch (US-018). The page and the consent dialog show
// the same text. The keys mirror CONTENT.md (`privacy.p1`, ...).
import type { PrivacyDictionary } from '../../lib/lead/types';

export const privacy: PrivacyDictionary = {
  privacy: {
    title: 'Aviso de Privacidad',
    draft_label: 'Borrador — pendiente de revisión legal',
    close: 'Cerrar',
    p1:
      'Responsable del tratamiento: Gaby Kelly (Gabriela Kelly). Contacto: {contact_email} (dato por confirmar).',
    p2:
      'Datos que recopilamos: nombre completo, correo electrónico, teléfono (WhatsApp), tu respuesta a la pregunta de preselección, el idioma en el que ves el sitio, y la fecha y hora de tu envío. Si usás la calculadora, guardamos tu nombre, tu correo, tu WhatsApp si lo das, tu resultado (meses y zona), la moneda que elegiste, si una parte grande de tus inversiones está en acciones de tu empresa (sí o no), si aceptaste recibir los correos de Gaby, el idioma y la fecha y hora; las cifras que escribís en la calculadora no se guardan ni se envían.',
    p3:
      'Para qué los usamos: para contactarte sobre la llamada inicial y la Mentoría VIP, para priorizar las llamadas y, si usas la calculadora, para mostrarte tu resultado y enviártelo por correo con la guía y, solo si lo aceptas, enviarte los correos de Gaby, de los que puedes darte de baja en cualquier momento. No los usamos para ningún otro fin ni los vendemos.',
    p4:
      'Con quién los compartimos: con Google (almacenamiento en Google Sheets) y con GoHighLevel, la plataforma de Gaby, que recibe tu contacto (tu nombre, correo, teléfono si lo das e idioma y, según el formulario, tu resultado de la calculadora o tu respuesta de preselección), envía los correos y agenda la llamada. Ambos pueden almacenar información fuera de Costa Rica.',
    p5:
      'Carácter voluntario: brindar tus datos es opcional. Sin ellos no podemos procesar tu aplicación, agendar tu llamada ni mostrarte el resultado de la calculadora desde este sitio.',
    p6:
      'Tus derechos: puedes solicitar acceso, rectificación, cancelación (eliminación) u oposición al tratamiento de tus datos escribiendo a {contact_email}.',
    p7:
      'Plazo de conservación: por definir; se actualizará cuando se complete la revisión legal.',
    p8:
      'Cada envío queda asociado a la versión de este aviso vigente en el momento de tu envío.',
  },
};
