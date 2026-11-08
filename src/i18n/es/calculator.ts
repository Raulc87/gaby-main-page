// Calculator copy (ES). Owned by Implementation Agent 2. Source: docs/ux/CONTENT.md
// section 11 (copied verbatim, checked by tests/unit/i18n/calculator-content.test.ts).
// All keys are provisional: the page is a shell with a placeholder formula until Gaby's
// calculator replaces the questions, formula and zones (US-035).
import type { CalculatorDictionary } from '../../lib/calculator/types';

export const calculator: CalculatorDictionary = {
  eyebrow: 'Diagnóstico gratis · 3 minutos',
  title: '¿Cuántos meses podrías sostenerte *si cambiara tu puesto?*',
  lead: 'Cinco datos sobre tu dinero hoy. Usa la misma moneda en todos.',
  figures: {
    expenses: {
      label: 'Gastos mensuales de tu hogar',
      hint: 'Lo que gastas en un mes normal: vivienda, comida, servicios, transporte, educación.',
    },
    debt: {
      label: 'Pagos mensuales de deudas',
      hint: 'Tarjetas, préstamos y otras cuotas. Si no tienes, escribe 0.',
    },
    savings: {
      label: 'Ahorros disponibles',
      hint: 'Dinero que podrías usar ya: cuentas de ahorro, efectivo, fondo de emergencia.',
    },
    investments: {
      label: 'Inversiones que podrías vender en un mes',
      hint: 'Acciones, fondos o ETFs. No incluyas tu casa ni tu pensión. Si no tienes, escribe 0.',
    },
    other_income: {
      label: 'Ingresos mensuales sin tu salario',
      hint: 'Alquileres, un negocio propio u otros ingresos que seguirían si dejaras tu puesto. Si no tienes, escribe 0.',
    },
  },
  next: 'Ver mi resultado',
  errors: {
    number: 'Escribe un número igual o mayor que 0.',
    no_outflow: 'Tus gastos y pagos de deudas no pueden sumar 0.',
  },
  capture: {
    title: 'Tu resultado está listo',
    body: 'Déjanos tus datos para verlo.',
    phoneLabel: 'WhatsApp (opcional)',
    consent: {
      text: 'Acepto el tratamiento de mis datos personales según el {privacy_notice_link} para ver mi resultado y recibirlo por correo.',
      linkLabel: 'Aviso de Privacidad',
    },
    marketing: 'Quiero recibir los correos de Gaby: seis correos en dos semanas sobre cómo ordenar e invertir mi dinero, con invitaciones a una llamada inicial, y después un correo semanal. Puedo darme de baja en cualquier momento.',
    submit: 'Ver mi resultado',
  },
  result: {
    label: 'Con tu dinero de hoy, sin tu salario, podrías sostenerte',
    months: '{months} meses',
    covered: 'Tus otros ingresos ya cubren tus gastos y deudas.',
    emailNote: 'Te enviamos tu resultado y la guía "Cómo empezar a invertir siendo ejecutivo" a tu correo.',
    disclaimer: 'Este cálculo es una estimación educativa con los datos que escribiste; no es una recomendación financiera.',
    restart: 'Calcular de nuevo',
  },
  zones: {
    alert: {
      title: 'Zona de alerta',
      body: 'Menos de 6 meses. Es el momento de ordenar tu dinero y construir tu colchón.',
    },
    building: {
      title: 'Zona de construcción',
      body: 'De 6 a menos de 12 meses. Vas bien: ahora se trata de poner tu dinero a trabajar.',
    },
    freedom: {
      title: 'Zona de libertad',
      body: '12 meses o más. Tienes margen para decidir sobre tu carrera desde la libertad.',
    },
  },
};
