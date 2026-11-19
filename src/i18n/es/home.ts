// Home copy (docs/ux/CONTENT.md section 5), copied verbatim by key: `home.hero.title`
// is `home.hero.title` here. Keys that CONTENT.md defines as another key
// (`home.story.media.label` = `story.media.label`, `home.story.cta` = `cta.read_story`,
// `home.mastery.eyebrow` and `home.vip.eyebrow` = `vip_band.eyebrow`, `home.vip.title`
// = `vip_band.title`, `home.mastery.cta` and `home.vip.cta` = `cta.vip_apply`) are read
// from common.ts, never copied. `*text*` marks the italic emphasis. Changing copy
// means changing CONTENT.md first.
import type { HomeDictionary } from '../index';

export const home: HomeDictionary = {
  home: {
    hero: {
      eyebrow:
        'Mentoría financiera para ejecutivos y profesionales corporativos',
      title:
        'Ganas bien, pero tu dinero *no te está dando tranquilidad.*',
      lead:
        'Te acompaño a ordenar tu dinero, convertir los beneficios de tu carrera en capital e invertir para construir patrimonio y libertad, sin tener que renunciar a lo que has construido.',
      cta:
        'Aplica a la Mentoría VIP',
      secondary:
        'Calcula tus meses de libertad gratis',
      trust:
        '18 años en el mundo corporativo · Más de 10 años invirtiendo',
      photo: {
        placeholder:
          'Foto de Gaby en su vida de libertad',
      },
      photo_alt:
        'Gaby Kelly disfrutando de su libertad',
    },
    ladder: {
      title:
        'Subiste la escalera corporativa. *¿Y tu libertad?*',
      p1:
        'Más rango, más gente a cargo, cuotas cada vez más altas, aumentos, viajes. Por fuera, todo va bien.',
      p2:
        'Pero aunque trabajes desde casa, tu mente no está ahí. Está en la cuota, en el equipo, en la próxima reunión. Sientes que *todo depende de ti*.',
      p3:
        'Mientras tanto, cada aumento se va en un estilo de vida un poco más caro.',
      closing:
        'Nadie debería tener que elegir entre su carrera y estar presente para su familia.',
    },
    stakes: {
      title:
        'Si nada cambia, en cinco años…',
      '1': {
        title:
          'Tienes un gran currículum, pero no patrimonio.',
        body:
          'Ganaste bien durante años y aun así tu tranquilidad depende del próximo depósito de planilla.',
      },
      '2': {
        title:
          'Tu libertad depende de un puesto que no controlas.',
        body:
          'Si mañana tu puesto cambiara, no sabrías con certeza cuántos meses podrías sostenerte.',
      },
      '3': {
        title:
          'Los años con tu familia pasan sin ti.',
        body:
          'Estás en la cena, pero tu cabeza sigue en la oficina. Ese tiempo no se recupera.',
      },
      closing:
        'No tiene que ser así. Y no tienes que descubrirlo tan tarde como yo.',
      cta:
        '¿Cuántos meses podrías sostenerte tú? Calcúlalo gratis',
    },
    story: {
      eyebrow:
        'Mi historia',
      title:
        'Yo estuve donde *estás tú.*',
      p1:
        'Trabajé 18 años en el mundo corporativo, con partners de Intel, Microsoft y Oracle. Era mamá sola y, por subir la escalera, sacrifiqué mucho tiempo con mi hija.',
      p2:
        'Me di cuenta tarde de la oportunidad que tenía en las manos. Hoy, después de más de 10 años construyendo mi portafolio, acompaño a ejecutivos y profesionales del mundo corporativo a convertir un buen salario en patrimonio, sin esperar tanto como yo.',
      stat: {
        '1': {
          value:
            '18',
          label:
            'años corporativos',
        },
        '2': {
          value:
            '10+',
          label:
            'años invirtiendo',
        },
        '3': {
          value:
            '200+',
          label:
            'personas acompañadas',
        },
      },
      portrait_alt:
        'Retrato de Gaby Kelly',
    },
    opportunity: {
      eyebrow:
        'La oportunidad que tienes en las manos',
      title:
        'Tu carrera ya te dio las herramientas. *Te falta el sistema.*',
      lead:
        'Trabajar en una transnacional o una gran corporación te da beneficios que casi nadie aprovecha. Si no inflas tu estilo de vida, se convierten en capital para invertir.',
      '1': {
        title:
          'Salario alto y aumentos',
        body:
          'Cada aumento puede ir a tu patrimonio.',
      },
      '2': {
        title:
          'Seguros médicos y de vida',
        body:
          'Gastos cubiertos que no salen de tu bolsillo.',
      },
      '3': {
        title:
          'Carro y allowances',
        body:
          'Flujo de caja liberado cada mes.',
      },
      '4': {
        title:
          'Viajes y viáticos',
        body:
          'Comida y viajes fuera de tu presupuesto.',
      },
      '5': {
        title:
          'Inglés y acceso a EE. UU.',
        body:
          'Puertas a mercados de inversión internacionales.',
      },
      '6': {
        title:
          'Roce y contactos',
        body:
          'Una red que vale oro cuando construyes algo propio.',
      },
    },
    method: {
      eyebrow:
        'El Método Polaris',
      title:
        'Tres pasos para que tu salario *trabaje para ti.*',
      '1': {
        title:
          'Define tu Norte',
        body:
          'Claridad sobre lo que quieres y sobre tu relación con el dinero.',
      },
      '2': {
        title:
          'Ordena tu dinero',
        body:
          'Tu sistema de billeteras: cada ingreso y cada beneficio con un propósito.',
      },
      '3': {
        title:
          'Invierte y construye patrimonio',
        body:
          'Decisiones conscientes, alineadas con la vida que quieres.',
      },
      cta:
        'Quiero aplicar el Método Polaris con Gaby',
    },
    mastery: {
      title:
        'Lo que aprendes *en la mentoría.*',
      lead:
        'No es teoría: es lo mismo que aplico en mi propio portafolio desde hace más de 10 años, explicado para que tú puedas entenderlo, evaluarlo y decidir.',
      '1': {
        title:
          'Tu Norte y tu relación con el dinero',
        body:
          'Claridad sobre la vida que quieres y las creencias que hoy te frenan.',
      },
      '2': {
        title:
          'Sistema de billeteras',
        body:
          'Ordenas cada ingreso y cada beneficio con un propósito.',
      },
      '3': {
        title:
          'Beneficios corporativos y flujo',
        body:
          'Conviertes lo que tu empresa ya te da en capital para invertir.',
      },
      '4': {
        title:
          'Bolsa y ETFs',
        body:
          'Entiendes cómo funcionan los mercados y cómo evaluar una inversión.',
      },
      '5': {
        title:
          'Bienes raíces',
        body:
          'Cómo analizar una propiedad como inversión, no como gasto.',
      },
      '6': {
        title:
          'Commodities: oro y plata',
        body:
          'Su papel como protección dentro de un portafolio.',
      },
      '7': {
        title:
          'Cripto',
        body:
          'Entiendes cómo funciona y cómo pensarla con criterio y sin euforia.',
      },
    },
    change: {
      title:
        'Así se ve tu vida *con el sistema funcionando.*',
      before: {
        label:
          'Hoy',
        '1':
          'Cada aumento se va en un estilo de vida más caro',
        '2':
          'No sabes cuántos meses podrías sostenerte',
        '3':
          'Los beneficios corporativos se pierden sin propósito',
        '4':
          'Inviertes poco, tarde o con miedo',
        '5':
          'Estás en casa, pero tu cabeza sigue en el trabajo',
      },
      after: {
        label:
          'Con el Método Polaris',
        '1':
          'Cada aumento va directo a tu patrimonio',
        '2':
          'Sabes exactamente con cuánto cuentas',
        '3':
          'Tus beneficios se convierten en capital para invertir',
        '4':
          'Inviertes con un plan y con claridad',
        '5':
          'Decides sobre tu carrera desde la libertad, y estás presente de verdad',
      },
    },
    testimonials: {
      title:
        'Lo que dicen quienes ya dieron el paso.',
      cta:
        'Quiero resultados como estos',
    },
    calculator: {
      eyebrow:
        'Diagnóstico gratis · 3 minutos',
      title:
        '¿Cuántos meses podrías sostenerte *si cambiara tu puesto?*',
      lead:
        'Cinco datos y descubres cuánto tiempo te da hoy tu dinero sin tu salario.',
      receive:
        'Recibes tu resultado y tu zona al instante.',
      receive_with_guide:
        'Recibes tu resultado, tu zona y la guía "Cómo empezar a invertir siendo ejecutivo".',
      cta:
        'Calcular mis meses gratis',
      example: {
        label:
          'Ejemplo de resultado',
        value:
          '4,4 meses',
        zone:
          'Zona de alerta',
      },
      more:
        'Más recursos en la biblioteca:',
    },
    vip: {
      body:
        'Imagina saber exactamente con cuánto cuentas, tener tu dinero trabajando a tu favor y, cuando estés con tu familia, estar ahí de verdad.',
      step: {
        '1': {
          title:
            'Aplica',
          body:
            'Una breve aplicación de 5 minutos.',
        },
        '2': {
          title:
            'Llamada inicial conmigo',
          body:
            'Vemos dónde estás y si la mentoría es para ti.',
        },
        '3': {
          title:
            'Empezamos tu plan',
          body:
            'Definimos tu Norte y arrancamos con tu sistema.',
        },
      },
    },
  },
  testimonial: {
    placeholder: {
      text:
        'Testimonio real: antes y resultado concreto',
      video:
        'Testimonio en video',
      photo:
        'Foto real',
      attribution:
        'Nombre · cargo · industria',
    },
  },
};
