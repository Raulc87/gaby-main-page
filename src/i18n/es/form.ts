// Lead form copy (ES). Owned by Implementation Agent 2 (see SPRINT_001.md
// file ownership map). Source: docs/ux/UX_UI_DIRECTION.md section 4
// (sections 7-8) and docs/specs/LEAD_API_CONTRACT.md section 8 (field error
// codes). Filled in progressively across GK-004-lead-form,
// GK-005-pre-screening, GK-011-privacy-consent, and GK-007-calendly.
import type { FormDictionary } from '../../lib/lead/types';

export const form: FormDictionary = {
  formTitle: 'Da el primer paso',
  name: {
    label: 'Nombre completo',
    hint: 'Escribe tu nombre y apellido(s).',
  },
  email: {
    label: 'Correo electrónico',
  },
  phone: {
    label: 'Teléfono (WhatsApp)',
    hint: 'Incluye el código de país. Ejemplo: +50684104791',
  },
  screening: {
    prompt:
      'Si este programa encaja con lo que buscas, ¿cuál es tu disposición para invertir en mejorar tu salud financiera?',
    options: [
      { code: 'ready_to_invest', label: 'Quiero invertir si el programa es adecuado para mí.' },
      {
        code: 'needs_investment_info',
        label: 'Tengo disposición, pero necesito conocer la inversión primero.',
      },
      {
        code: 'no_capacity_now',
        label: 'Me interesa, pero actualmente no tengo capacidad para invertir.',
      },
      { code: 'exploring', label: 'Solo estoy explorando por ahora.' },
    ],
  },
  consent: {
    text: 'Acepto el tratamiento de mis datos personales según el {privacy_notice_link}.',
    linkLabel: 'Aviso de Privacidad',
  },
  privacyNotice: {
    title: 'Aviso de Privacidad',
    draftLabel: 'Borrador — pendiente de revisión legal',
    closeLabel: 'Cerrar',
    paragraphs: [
      'Responsable del tratamiento: Gabriela Kelly. Contacto: {contact_email} (dato por confirmar).',
      'Datos que recopilamos: nombre completo, correo electrónico, teléfono, tu respuesta a la pregunta de preselección, el idioma en el que ves la página, y la fecha y hora de tu envío.',
      'Para qué los usamos: para contactarte sobre la llamada inicial y el programa, y para priorizar las llamadas. No los usamos para ningún otro fin ni los vendemos.',
      'Con quién los compartimos: con Google (almacenamiento en Google Sheets) y Calendly (agendamiento de la llamada), que pueden almacenar información fuera de Costa Rica.',
      'Carácter voluntario: brindar tus datos es opcional. Sin ellos no podemos procesar el formulario ni agendar tu llamada desde esta página.',
      'Tus derechos: puedes solicitar acceso, rectificación, cancelación (eliminación) u oposición al tratamiento de tus datos escribiendo a {contact_email}.',
      'Plazo de conservación: por definir; se actualizará cuando se complete la revisión legal.',
      'Cada envío queda asociado a la versión de este aviso vigente en el momento de tu envío.',
    ],
  },
  submit: {
    idle: 'Enviar y agendar mi llamada',
    submitting: 'Enviando…',
  },
  fieldErrors: {
    required: 'Este campo es obligatorio.',
    too_short: 'Es demasiado corto.',
    too_long: 'Es demasiado largo.',
    invalid_characters: 'Usa solo letras, espacios, apóstrofos, guiones o puntos.',
    full_name_required: 'Escribe tu nombre completo: nombre y al menos un apellido.',
    invalid_format_email: 'Escribe un correo válido, por ejemplo nombre@dominio.com.',
    invalid_format_phone: 'Escribe el número con código de país, por ejemplo +50684104791.',
    invalid_option: 'Selecciona una opción.',
    consent_required: 'Necesitamos tu aceptación para poder guardar tus datos.',
  },
  submissionError:
    'No pudimos guardar tu información. Por favor, inténtalo de nuevo en unos minutos. Si el problema continúa, escríbenos a {contact_email}.',
};
