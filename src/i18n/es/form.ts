// Lead form copy (ES). Owned by Implementation Agent 2. Source: docs/ux/CONTENT.md
// sections 8.3-8.5 (copied verbatim, checked by tests/unit/i18n/form-content.test.ts)
// and docs/specs/LEAD_API_CONTRACT.md section 8 (field error codes). The privacy
// notice text is in privacy.ts.
import type { FormDictionary } from '../../lib/lead/types';

export const form: FormDictionary = {
  formTitle: 'Aplica a la Mentoría VIP',
  name: {
    label: 'Nombre completo',
    hint: 'Escribe tu nombre y apellido(s).',
  },
  email: {
    label: 'Correo electrónico',
  },
  phone: {
    label: 'WhatsApp',
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
  submit: {
    idle: 'Enviar mi aplicación',
    submitting: 'Enviando…',
  },
  trust: 'Llamada inicial sin costo · Tus datos protegidos (Ley 8968)',
  thankYou: {
    title: '¡Gracias por tu información!',
    text: 'Es posible que te contactemos por correo electrónico o WhatsApp. Si lo deseas, puedes agendar ahora tu llamada inicial:',
  },
  notReady: {
    title: 'Gracias por contarnos dónde estás hoy.',
    text: 'Es posible que te contactemos por correo electrónico o WhatsApp. Cuando sea tu momento, aquí estaremos. Mientras tanto, puedes empezar gratis con el minicurso:',
  },
  calendlyFallback:
    'No pudimos cargar el calendario. Escríbenos a {contact_email} y coordinamos tu llamada.',
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
  rateLimited:
    'Recibimos varios intentos seguidos desde tu conexión. Por favor, espera unos minutos e inténtalo de nuevo. Si lo prefieres, escríbenos a {contact_email}.',
};
