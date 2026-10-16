// Home copy (docs/ux/CONTENT.md section 5), copied verbatim by key: `home.hero.title`
// is `home.hero.title` here. Keys that CONTENT.md defines as another key
// (`home.hero.cta` = `cta.vip_long`, `home.hero.secondary` = `cta.start_free`,
// `home.resources.cta` = `cta.all_resources`, `home.story.p1-p3` = `story.p1-p3`,
// `home.story.cta` = `cta.read_story`) are read from common.ts and story.ts, never
// copied. `*text*` marks the italic emphasis. Changing copy means changing
// CONTENT.md first.
import type { HomeDictionary } from '../index';

export const home: HomeDictionary = {
  home: {
    hero: {
      eyebrow: 'Del mundo corporativo a tu libertad financiera',
      title:
        'Ganas bien, pero tu dinero *no te está dando tranquilidad.*',
      lead:
        'Mentoría financiera para ejecutivos y profesionales de transnacionales. Te acompaño a ordenar tu dinero, aprovechar los beneficios de tu carrera e invertir para construir patrimonio y libertad.',
      trust:
        '18 años en el mundo corporativo · Más de 10 años invirtiendo',
      photo_alt: 'Gaby Kelly sonriendo',
    },
    ladder: {
      title: 'Subiste la escalera corporativa. *¿Y tu libertad?*',
      p1:
        'Más rango, más gente a cargo, cuotas cada vez más altas, aumentos, viajes. Por fuera, todo va bien.',
      p2:
        'Pero aunque trabajes desde casa, tu mente no está ahí. Está en la cuota, en el equipo, en la próxima reunión. Cada vez más cosas dependen de ti, y sientes que *todo depende de ti*.',
      p3:
        'Mientras tanto, cada aumento se va en un estilo de vida un poco más caro y, si mañana tu puesto cambiara, no sabrías con certeza cuántos meses podrías sostenerte.',
      closing:
        'Nadie debería tener que elegir entre su carrera y estar presente para su familia.',
    },
    opportunity: {
      eyebrow: 'La oportunidad que tienes en las manos',
      title:
        'Tu carrera ya te dio las herramientas. *Te falta el sistema.*',
      lead:
        'Si no inflas tu estilo de vida, los beneficios corporativos se convierten en capital para invertir. Casi nadie te enseña a verlos así.',
      '1': {
        title: 'Salario alto y aumentos',
        body:
          'Cada aumento puede ir a tu patrimonio, no a un estilo de vida más caro.',
      },
      '2': {
        title: 'Seguros médicos y de vida',
        body:
          'Gastos que ya están cubiertos y no tienes que pagar de tu bolsillo.',
      },
      '3': {
        title: 'Carro y allowances',
        body: 'Beneficios que liberan flujo de caja cada mes.',
      },
      '4': {
        title: 'Viajes y viáticos',
        body: 'Comida y viajes pagados que no salen de tu presupuesto.',
      },
      '5': {
        title: 'Inglés y acceso a Estados Unidos',
        body:
          'Puertas a plataformas y mercados de inversión internacionales.',
      },
      '6': {
        title: 'Roce y contactos',
        body: 'Una red que vale oro cuando decides construir algo propio.',
      },
    },
    method: {
      eyebrow: 'El Método Polaris',
      title: 'Tres pasos para que tu salario *trabaje para ti.*',
      '1': {
        title: 'Define tu Norte',
        body:
          'Claridad sobre lo que quieres y sobre tu relación con el dinero.',
      },
      '2': {
        title: 'Ordena tu dinero',
        body:
          'Tu sistema de billeteras: cada ingreso y cada beneficio con un propósito.',
      },
      '3': {
        title: 'Invierte y construye patrimonio',
        body:
          'Decisiones de inversión conscientes, alineadas con la vida que quieres.',
      },
    },
    resources: {
      eyebrow: 'Recursos gratuitos',
      title: 'Empieza hoy, *sin costo.*',
    },
    story: {
      eyebrow: 'Mi historia',
      title: 'Del mundo corporativo *a mi libertad.*',
    },
    testimonials: {
      title: 'Lo que dicen quienes ya dieron el paso.',
    },
  },
  testimonial: {
    placeholder: {
      text: 'Testimonio de una clienta o cliente',
      video: 'Testimonio en video de una clienta o cliente',
      attribution: 'Nombre · cargo · empresa o industria',
    },
  },
};
