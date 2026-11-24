// Calculator copy (ES). Owned by Implementation Agent 2. Source: docs/ux/CONTENT.md
// section 11 (Gaby's calculator, phase 2d), copied verbatim and checked by
// tests/unit/i18n/calculator-content.test.ts.
import type { CalculatorDictionary } from '../../lib/calculator/types';

export const calculator: CalculatorDictionary = {
  eyebrow: 'Diagnóstico gratis · 3 minutos',
  title: '¿Cuántos meses podrías sostenerte *si cambiara tu puesto?*',
  lead: 'Cinco datos, tres minutos. Descubrí cuánto tiempo te da hoy tu dinero sin tu salario.',
  figures: {
    title: 'Tus números',
    currency: {
      label: 'Moneda',
      usd: 'USD',
      crc: 'Colones',
    },
    exampleNote: 'Ya viene con un ejemplo cargado. Cambialo por tus números.',
    expenses: {
      label: '¿Cuánto gastás al mes para vivir como vivís hoy?',
      hint: 'Casa, comida, colegios, carro, seguros, salidas. Todo.',
    },
    savings: {
      label: '¿Cuánto tenés en cuentas de ahorro y billeteras?',
    },
    investments: {
      label: '¿Cuánto tenés en inversiones que podrías vender en menos de un mes?',
      hint: 'Fondos, acciones, ETFs, CDPs. No incluyás tu casa.',
    },
    solidarity: {
      label: '¿Cuánto tenés en la asociación solidarista?',
      hint: 'Lo que recibirías si dejaras la empresa. Si no sabés, poné 0.',
    },
    passive: {
      label: '¿Cuánto te entra al mes sin trabajar?',
      hint: 'Alquileres, dividendos, intereses.',
    },
    shares: {
      label: '¿Qué parte de tus inversiones está en acciones de tu empresa?',
      placeholder: 'Elegí una opción',
      options: {
        none: 'No tengo acciones de mi empresa',
        under_20: 'Menos del 20%',
        from_20_to_50: 'Entre 20% y 50%',
        over_50: 'Más del 50%',
      },
    },
  },
  errors: {
    expenses: 'Escribí cuánto gastás al mes para poder calcular.',
    shares: 'Elegí qué parte de tus inversiones está en acciones de tu empresa.',
    number: 'Escribí un número igual o mayor que 0.',
  },
  next: 'Calcular mis meses',
  capture: {
    title: 'Tu resultado está listo',
    body: 'Dejanos tus datos para verlo.',
    bodyWithGuide: '¿A dónde te lo enviamos? También te llega la guía "Cómo empezar a invertir siendo ejecutivo".',
    phoneLabel: 'WhatsApp (opcional)',
    consent: {
      text: 'Acepto el tratamiento de mis datos personales según el {privacy_notice_link} para ver mi resultado y recibirlo por correo.',
      linkLabel: 'Aviso de Privacidad',
    },
    marketing: 'Quiero recibir los correos de Gaby: seis correos en dos semanas sobre cómo ordenar e invertir mi dinero, con invitaciones a una llamada inicial, y después un correo semanal. Puedo darme de baja en cualquier momento.',
    submit: 'Ver mi resultado',
  },
  result: {
    label: 'Tus meses de libertad',
    unit: { one: 'mes', many: 'meses' },
    zones: {
      critical: {
        label: 'Zona crítica',
        title: 'Tu tranquilidad depende de tu próximo salario.',
        body: 'Si mañana cambiara tu puesto, tendrías menos de tres meses de margen. La buena noticia: con un buen salario, este número puede crecer rápido cuando tenés un sistema.',
      },
      alert: {
        label: 'Zona de alerta',
        title: 'Tenés un colchón, pero es delgado.',
        body: 'Podrías sostenerte unos meses, pero un cambio en tu trabajo te obligaría a decidir desde la presión. El siguiente paso es separar con propósito cada mes.',
      },
      building: {
        label: 'Base en construcción',
        title: 'Vas bien. Ahora toca ponerlo a trabajar.',
        body: 'Tenés una base real. El reto es que ese dinero no se quede quieto: que empiece a generar ingresos para que no todo dependa de tu salario.',
      },
      path_to_freedom: {
        label: 'Camino a la libertad',
        title: 'Tenés margen para decidir con calma.',
        body: 'Podés tomar decisiones de carrera desde la libertad. El siguiente nivel es que tus inversiones paguen una parte creciente de tus gastos.',
      },
      solid_cushion: {
        label: 'Colchón sólido',
        title: 'Tu dinero ya te da años de tranquilidad.',
        body: 'Tenés más de tres años de margen. La pregunta ahora es si ese patrimonio está trabajando todo lo que podría y bien diversificado.',
      },
      financially_free: {
        label: 'Libre financieramente',
        title: 'Tus ingresos pasivos ya cubren tus gastos.',
        body: 'Ganaste el juego: tus inversiones pagan tu vida. Ahora se trata de proteger y hacer crecer ese patrimonio.',
      },
    },
    gaugeMax: '36+ meses',
    available: 'Dinero disponible sin tu salario',
    gap: 'Lo que te falta cubrir cada mes',
    alert: { lead: 'Ojo con la concentración.', body: 'Una parte grande de tus inversiones está en tu propia empresa. Si a la empresa le va mal, podrías perder salario y ahorros al mismo tiempo.' },
    nextStep: { title: '¿Cómo subo este número?', body: 'Con un sistema: billeteras, los beneficios de tu empresa trabajando para vos y un plan de inversión. Es lo que construimos juntos en Wealth Mastery, con el Método Polaris.' },
    emailNote: 'Te enviamos tu resultado y la guía "Cómo empezar a invertir siendo ejecutivo" a tu correo.',
    disclaimer: 'Este cálculo es una estimación educativa con los datos que ingresaste. No incluye impuestos, comisiones ni cambios en tus gastos, y no constituye una recomendación de inversión. Gaby Kelly es inversora y mentora; no es asesora financiera.',
    restart: 'Calcular otra vez',
  },
};
