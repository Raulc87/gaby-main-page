# Gaby's final content for phase 2d — text export (2026-11-23)

Sources, received by the human owner from Gaby Kelly and shared with the coordinator on 2026-11-23:

1. **Gaby's email** answering the open content questions. Section 1.
2. **`pagina-wealth-mastery.html`**: the new Wealth Mastery page, an HTML mock-up with yellow notes for Raúl. Section 2.
3. **`home-gabykelly.html`**: the Home with her adjustments to the StoryBrand dummy of 2026-11-08 (same notes). Section 3.
4. **`calculadora-meses-de-libertad.html`**: her working calculator prototype. Section 4.
5. **`calculador_de_pagina_web.mp4`**: a 13-second screen recording of the prototype, with no narration. Section 5.
6. **The embed code of her GoHighLevel calendar** (ADR-006, US-037). Section 6.

This file keeps those sources in the repository so the source of `PROJECT_SPEC.md` v0.7 stays reviewable. As with [`BRIEF_2026-11-08_STORYBRAND.md`](BRIEF_2026-11-08_STORYBRAND.md), it is a **reference**, not a source agents implement from: copy comes from [`CONTENT.md`](CONTENT.md) (phase 2d copy staged in `CONTENT_PHASE_2D.md`, written in its own docs PR before Sprint 005), layout from [`UX_UI_DIRECTION.md`](UX_UI_DIRECTION.md). Page text is verbatim (Spanish, voseo), one quoted line per text block, in reading order. How the files were read, and what was lost in them, is in section 7. The human owner's decisions on these sources are in section 8.

## 1 · Gaby's email (2026-11-23)

Verbatim, as the owner relayed it.

> Hola Raúl,
> Te mando lo que faltaba para la web. Van tres archivos adjuntos; abrilos en el navegador:
>
> * calculadora-meses-de-libertad.html: prototipo que ya funciona. Hay que replicar su lógica y sus textos tal cual.
> * pagina-wealth-mastery.html: la página nueva que faltaba, con la explicación del Método Polaris.
> * home-gabykelly.html: la portada con los ajustes de abajo.
>
> Las notas amarillas de las páginas son instrucciones para vos, no van publicadas.
>
> 1. Ajustes generales
>
> * Todo el sitio va con vos (ni tú ni usted).
> * "Mentoría VIP" ya no se usa. El programa se llama Wealth Mastery. Todos los botones dicen "Aplicá a Wealth Mastery".
> * Menú: Mi historia · Wealth Mastery · Diagnóstico gratis, y el botón "Aplicá a Wealth Mastery".
>    * "Wealth Mastery" lleva a la página nueva.
>    * "Diagnóstico gratis" lleva a la calculadora.
> * Un solo recurso gratis: la calculadora. No hay biblioteca de recursos, así que se quitan los enlaces a "Radiografía de beneficios" y "Diagnóstico de inversionista".
>
> 2. Método Polaris
>
> * Polaris es la Estrella Polar: tu norte, el que guía el camino. Nació del propio portafolio de Gaby, con más de 10 años invirtiendo.
> * Tiene tres pilares:
>    * Mentalidad (Mentalidad Millonaria)
>    * Administración (Administración del Dinero)
>    * Inversión (Inversiones e Ingresos Pasivos)
> * Importante: los pilares van sin números y sin flechas. No son pasos en orden: se trabajan los tres en paralelo con cada ingreso.
> * En la portada va la versión corta, con el enlace "Conocé Wealth Mastery →". En la página nueva va el detalle de cada pilar.
>
> 3. Página Wealth Mastery (nueva)
> Tiene estas secciones, en este orden:
>
> 1. Hero
> 2. ¿Es para vos? / No es para vos
> 3. El Método Polaris con sus tres pilares
> 4. Cómo funciona: programa de 3 meses, sesiones 1 a 1 cada 15 días, biblioteca de contenido y comunidad de graduados
> 5. Quién te guía
> 6. Testimonios
> 7. Preguntas frecuentes, en formato acordeón
> 8. CTA final
>
> No se publican precios.
>
> 4. Calculadora: las fórmulas
>
> * Dinero disponible = cuentas y billeteras + inversiones que se puedan vender en menos de un mes + asociación solidarista
> * Faltante mensual = gastos mensuales − ingresos pasivos
> * Si el faltante es 0 o menos, el resultado es "∞" con la zona "Libre financieramente".
> * Si no: meses = dinero disponible ÷ faltante mensual.
>    * Con menos de 10 meses se muestra un decimal con coma (por ejemplo, 4,4).
>    * Con 10 o más, se redondea.
> * Zonas:
>    * Menos de 3 meses: Zona crítica (#C98368)
>    * De 3 a 6: Zona de alerta (#E0A98F)
>    * De 6 a 12: Base en construcción (#D6B04D)
>    * De 12 a 36: Camino a la libertad (#D8C5B1)
>    * Más de 36: Colchón sólido (#D8C5B1)
>
> Los títulos y mensajes de cada zona están en el prototipo.
>
> * Alerta "Ojo con la concentración": aparece si la persona elige "Entre 20% y 50%" o "Más del 50%" en acciones de su propia empresa.
> * Moneda: USD o colones. En el prototipo el tipo de cambio está fijo en 500; dejalo configurable o usá el del día.
> * La persona deja nombre, correo (obligatorio y validado) y WhatsApp (opcional), y marca la casilla de consentimiento de la Ley 8968 antes de ver su resultado.
> * Quitá el aviso amarillo de "Prototipo" del paso 2.
>
> 5. GoHighLevel
>
> * Calculadora: crea o actualiza el contacto con el tag lead-calculadora.
> * Campos personalizados obligatorios: meses (número) y zona (texto). Si se puede, guardá también la moneda, los gastos, el dinero disponible y la alerta de concentración (sí/no).
> * El tag dispara la secuencia de 6 correos en 14 días. El correo 1 entrega el resultado y la guía "Cómo empezar a invertir siendo ejecutivo".
> * Aplicación a Wealth Mastery: formulario de GHL con el tag aplicacion-vip, que al terminar lleva al calendario que ya te mandé.
> * Si la persona agenda la llamada, sale de la secuencia.
>
> ¿Me confirmás si la calculadora la vas a montar dentro de la web con un webhook a GHL o con un formulario nativo de GHL? Así sé cómo probarla cuando esté lista.
> ¡Gracias!
> Gaby

## 2 · Wealth Mastery page (`pagina-wealth-mastery.html`)

Yellow notes are for Raúl and are not page copy; they are quoted with **Nota:**. The first line is the mock-up's own banner, not page copy.

> DUMMY · Página Wealth Mastery (nueva) Es la página a la que lleva "Wealth Mastery" en el menú. Las notas amarillas son para Raúl, no van en la página. Todo con vos.
>
> Gaby Kelly
>
> Mi historia
>
> Wealth Mastery
>
> Diagnóstico gratis
>
> Aplicá a Wealth Mastery
>
> Mentoría Wealth Mastery
>
> Convertí tu salario en patrimonio, con un sistema y conmigo a tu lado.
>
> Una mentoría individual para ejecutivos y profesionales del mundo corporativo que ganan bien y quieren que su dinero les dé tranquilidad y libertad. Trabajamos con el Método Polaris, el mismo que aplico en mi propio portafolio desde hace más de 10 años.
>
> Aplicá a Wealth Mastery
>
> Calculá tus meses de libertad gratis
>
> ¿Es para vos?
>
> Es para vos si…
>
> Ganás bien, subiste de puesto y aun así sentís que tu dinero no avanza.
>
> Tenés beneficios corporativos que no estás aprovechando.
>
> Querés invertir, pero no sabés por dónde empezar o te da miedo equivocarte.
>
> Gran parte de tus ahorros está en la acción de tu propia empresa.
>
> Querés decidir sobre tu carrera desde la libertad, no desde la necesidad.
>
> No es para vos si…
>
> Buscás que alguien invierta por vos o te diga qué comprar.
>
> Querés hacerte rico rápido o aprender trading.
>
> No estás dispuesto a cambiar hábitos con tu dinero.
>
> El Método Polaris
>
> Un norte claro para tu dinero, en tres pilares.
>
> Polaris es la Estrella Polar: tu norte, el que guía el camino. El método nació de mi propio portafolio y del patrimonio que construyo con mi familia: no es teoría, es lo que aplico y lo que me funcionó, ordenado para que vos lo podás aplicar.
>
> Mentalidad Millonaria
>
> Mentalidad
>
> Las creencias sobre el dinero que heredaste y que hoy te frenan.
>
> Tus patrones con el dinero, con evaluaciones de psicología financiera.
>
> Tu norte: la vida que querés construir y para qué.
>
> Administración del Dinero
>
> Administración
>
> Tu sistema de billeteras: cada ingreso se reparte con un propósito apenas entra.
>
> Tu billetera de confianza y tu protección: seguros médicos, de vida y de casa.
>
> Tus beneficios corporativos (aumentos, solidarista, allowances) convertidos en capital.
>
> Inversiones e Ingresos Pasivos
>
> Inversión
>
> Bolsa y ETFs: un portafolio simple y global, con aportes mensuales y sin trading.
>
> Bienes raíces: analizar una propiedad como inversión, no como gasto.
>
> Oro, plata y cripto: qué papel juegan y cómo guardarlos de forma segura.
>
> En paralelo, no en orden
>
> No tenés que pagar todas tus deudas antes de empezar a invertir. Con cada salario avanzás en los tres pilares al mismo tiempo: así se crea el hábito y tu patrimonio empieza a crecer desde ya.
>
> **Nota:** Para Raúl: los tres pilares van sin números y sin flechas entre ellos (no son pasos en orden). El sistema completo de billeteras no se publica; solo se menciona.
>
> Cómo funciona.
>
> Programa de 3 meses
>
> Tres meses para dejar tu sistema funcionando en los tres pilares.
>
> Sesiones 1 a 1 conmigo
>
> Por videollamada, cada 15 días. Trabajamos con tus números y tu situación real.
>
> Biblioteca de contenido
>
> Acceso a mis cursos y materiales para repasar a tu ritmo entre sesiones.
>
> Comunidad de graduados
>
> Al terminar seguís acompañado por otras personas que también están construyendo su libertad.
>
> **Nota:** Para Raúl: no se publican precios.
>
> FOTO DE GABY(distinta al retrato de la home)
>
> Quién te guía
>
> Soy Gaby Kelly.
>
> Pasé 18 años en el mundo corporativo, con partners de Intel, Microsoft y Oracle. Hoy invierto desde hace más de 10 años y administro el patrimonio de mi familia con el mismo método que te enseño.
>
> Soy inversora y mentora, no asesora financiera: no te digo qué comprar. Te enseño a entender, evaluar y decidir, para que tu dinero trabaje para vos.
>
> Leé mi historia completa →
>
> Lo que dicen quienes ya dieron el paso.
>
> Foto real
>
> "[Testimonio real: antes → resultado concreto]"
>
> [Nombre · cargo · industria]
>
> Testimonio en video
>
> [Nombre · cargo · industria]
>
> Foto real
>
> "[Testimonio real: antes → resultado concreto]"
>
> [Nombre · cargo · industria]
>
> **Nota:** Para Raúl: los mismos testimonios de la home sirven aquí.
>
> Preguntas frecuentes.
>
> ¿Me vas a decir en qué invertir?
>
> No. Aprendés a entender cómo funciona cada inversión y a evaluarla. Las decisiones son tuyas, con criterio propio.
>
> ¿Tengo que pagar mis deudas antes de empezar?
>
> No. Con cada ingreso avanzás en paralelo: deudas, protección e inversión al mismo tiempo.
>
> ¿Es presencial?
>
> No, todo es por videollamada. Podés estar en cualquier país.
>
> ¿Cuánto cuesta?
>
> Lo conversamos en la llamada inicial, cuando ya sepamos si Wealth Mastery es para vos.
>
> **Nota:** Para Raúl: formato acordeón. Gaby confirma las respuestas antes de publicar.
>
> Mentoría Wealth Mastery
>
> ¿Empezamos a construir tu libertad?
>
> 1
>
> Aplicá
>
> Una breve aplicación de 5 minutos.
>
> 2
>
> Llamada inicial conmigo
>
> Vemos dónde estás y si Wealth Mastery es para vos.
>
> 3
>
> Empezamos tu plan
>
> Definimos tu norte y arrancamos con tu sistema.
>
> Aplicá a Wealth Mastery
>
> **Nota:** Para Raúl: el mismo flujo de la home: formulario de aplicación en GHL (tag aplicacion-vip) → calendario de GHL.
>
> Gaby Kelly
>
> Del mundo corporativo a tu libertad financiera.
>
> Gaby Kelly es inversora y mentora; no es asesora financiera. El contenido es educativo y no constituye una recomendación de inversión. Tus datos protegidos según la Ley 8968.
>
> Aviso de privacidad
>

## 3 · Home with Gaby's adjustments (`home-gabykelly.html`)

As in the 2026-11-08 dummy, each section is marked *Nuevo*, *Movido*, *Ajustado* or *Se mantiene*; yellow notes are quoted with **Nota:**. The first line is the mock-up's legend.

> DUMMY · Leyenda:
>
> Nuevo
>
> Movido
>
> Ajustado
>
> Se mantiene
>
> Las notas amarillas son para Raúl, no van en la página.
>
> Gaby Kelly
>
> Mi historia
>
> Wealth Mastery
>
> Diagnóstico gratis
>
> Aplicá a Wealth Mastery
>
> 1 · Hero — ajustado
>
> Mentoría financiera para ejecutivos y profesionales corporativos
>
> Ganás bien, pero tu dinero no te está dando tranquilidad.
>
> Te acompaño a ordenar tu dinero, convertir los beneficios de tu carrera en capital e invertir para construir patrimonio y libertad, sin tener que renunciar a lo que ya construiste.
>
> Aplicá a Wealth Mastery
>
> Calculá tus meses de libertad gratis
>
> 18 años en el mundo corporativo · Más de 10 años invirtiendo
>
> **Nota:** Cambios: el eyebrow dice a quién le hablamos: el mundo corporativo como paraguas; "transnacional" aparece como ejemplo en la sección 5 y se usa directo en la pauta. El CTA de transición lleva directo a la calculadora, el único lead magnet de la home. Todo el sitio va con vos (no tú ni usted). Menú: Mi historia · Wealth Mastery (página nueva, ver el artboard "Página Wealth Mastery") · Diagnóstico gratis (lleva a la calculadora) + botón "Aplicá a Wealth Mastery". "Mentoría VIP" ya no se usa: el programa se llama Wealth Mastery en todo el sitio.
>
> FOTO DEL ESTADO DESEADOGaby en su vida de libertad (con familia, naturaleza, tranquila, sin laptop) o un cliente o clienta real.No retrato de estudio: ese va en la sección 4.
>
> 2 · El problema — se mantiene
>
> Subiste la escalera corporativa. ¿Y tu libertad?
>
> Más rango, más gente a cargo, cuotas cada vez más altas, aumentos, viajes. Por fuera, todo va bien.
>
> Pero aunque trabajés desde casa, tu mente no está ahí. Está en la cuota, en el equipo, en la próxima reunión. Cada vez más cosas dependen de vos, y sentís que todo depende de vos.
>
> Mientras tanto, cada aumento se va en un estilo de vida un poco más caro.
>
> Nadie debería tener que elegir entre su carrera y estar presente para su familia.
>
> **Nota:** La frase "si mañana tu puesto cambiara…" se mueve a la sección 3, donde queda con más fuerza.
>
> 3 · Lo que está en juego — nuevo
>
> Si nada cambia, en cinco años…
>
> Tenés un gran currículum, pero no patrimonio.
>
> Ganaste bien durante años y aun así tu tranquilidad depende del próximo depósito de planilla.
>
> Tu libertad depende de un puesto que no controlas.
>
> Si mañana tu puesto cambiara, no sabrías con certeza cuántos meses podrías sostenerte.
>
> Los años con tu familia pasan sin vos.
>
> Estás en la cena, pero tu cabeza sigue en la oficina. Ese tiempo no se recupera.
>
> No tiene que ser así. Y no tenés que descubrirlo tan tarde como yo.
>
> ¿Cuántos meses podrías sostenerte vos? Calculalo gratis ?
>
> 4 · La guía — movida arriba y acortada
>
> RETRATO PROFESIONAL DE GABY(única vez que aparece este retrato)
>
> Mi historia
>
> Yo estuve donde estás vos.
>
> Trabajé 18 años en el mundo corporativo, con partners de Intel, Microsoft y Oracle. Era mamá sola y, por subir la escalera, sacrifiqué mucho tiempo con mi hija.
>
> Me di cuenta tarde de la oportunidad que tenía en las manos. Hoy, después de más de 10 años construyendo mi portafolio, acompaño a ejecutivos y profesionales del mundo corporativo a convertir un buen salario en patrimonio, sin esperar tanto como yo.
>
> 18
>
> años corporativos
>
> 10+
>
> años invirtiendo
>
> [X]
>
> personas acompañadas
>
> Me han entrevistado en
>
> Logo Canal 13
>
> Logo Radio Azul
>
> Logo Radio Fides
>
> Leé mi historia completa →
>
> 5 · La oportunidad — se mantiene
>
> La oportunidad que tenés en las manos
>
> Tu carrera ya te dio las herramientas. Te falta el sistema.
>
> Trabajar en una transnacional o una gran corporación te da beneficios que casi nadie aprovecha. Si no inflás tu estilo de vida, se convierten en capital para invertir.
>
> Salario alto y aumentos
>
> Cada aumento puede ir a tu patrimonio.
>
> Seguros médicos y de vida
>
> Gastos cubiertos que no salen de tu bolsillo.
>
> Carro y allowances
>
> Flujo de caja liberado cada mes.
>
> Viajes y viáticos
>
> Comida y viajes fuera de tu presupuesto.
>
> Inglés y acceso a EE. UU.
>
> Puertas a mercados de inversión internacionales.
>
> Roce y contactos
>
> Una red que vale oro cuando construís algo propio.
>
> 6 · El plan: Método Polaris — ajustado (pilares oficiales, sin orden)
>
> El Método Polaris
>
> Tres pilares que avanzan juntos, con cada salario.
>
> Polaris es la Estrella Polar: tu norte, el que guía el camino. Así nació mi método, de más de 10 años construyendo mi propio portafolio: un norte claro para que cada decisión con tu dinero vaya en la misma dirección.
>
> Mentalidad Millonaria
>
> Mentalidad
>
> Tus creencias y patrones con el dinero, y la vida que querés construir.
>
> Administración del Dinero
>
> Administración
>
> Tu sistema de billeteras y tu protección: cada ingreso y cada beneficio con un propósito.
>
> Inversiones e Ingresos Pasivos
>
> Inversión
>
> Bolsa, bienes raíces, oro, plata y cripto: entender, evaluar y decidir.
>
> No es primero una cosa y después la otra: con cada ingreso avanzás en los tres al mismo tiempo.
>
> Aplicá a Wealth Mastery
>
> Conocé Wealth Mastery →
>
> **Nota:** Para Raúl: los pilares NO llevan números (01, 02, 03) ni se presentan como pasos en orden; Gaby enseña los tres en paralelo. Nombre corto como título y el nombre oficial como etiqueta arriba. "Conocé Wealth Mastery" lleva a la página nueva. La sección "Lo que aprendés" (antes 6B) se pasó a esa página.
>
> 7 · El éxito: antes y después — nuevo
>
> Así se ve tu vida con el sistema funcionando.
>
> Hoy
>
> Cada aumento se va en un estilo de vida más caro
>
> No sabés cuántos meses podrías sostenerte
>
> Los beneficios corporativos se pierden sin propósito
>
> Invertís poco, tarde o con miedo
>
> Estás en casa, pero tu cabeza sigue en el trabajo
>
> Con el Método Polaris
>
> Cada aumento va directo a tu patrimonio
>
> Sabés exactamente con cuánto contás
>
> Tus beneficios se convierten en capital para invertir
>
> Invertís con un plan y con claridad
>
> Decidís sobre tu carrera desde la libertad, y estás presente de verdad
>
> 8 · Prueba social — ajustado (fotos reales + CTA)
>
> Lo que dicen quienes ya dieron el paso.
>
> Foto real
>
> "[Testimonio real: antes → resultado concreto]"
>
> [Nombre · cargo · industria]
>
> Testimonio en video
>
> [Nombre · cargo · industria]
>
> Foto real
>
> "[Testimonio real: antes → resultado concreto]"
>
> [Nombre · cargo · industria]
>
> Quiero resultados como estos
>
> **Nota:** Prioridad #1 antes de lanzar: 2 o 3 testimonios reales con foto y permiso. Idealmente con un resultado concreto (ej. "en 6 meses armé mi billetera de confianza"). Nunca usar "fondo de emergencia".
>
> 9 · Diagnóstico gratis — el único recurso gratis
>
> Diagnóstico gratis · 3 minutos
>
> ¿Cuántos meses podrías sostenerte si cambiara tu puesto?
>
> Cinco datos y descubrís cuánto tiempo te da hoy tu dinero sin tu salario. Recibís tu resultado, tu zona y la guía "Cómo empezar a invertir siendo ejecutivo".
>
> Calcular mis meses gratis
>
> Ejemplo de resultado
>
> 4,4 meses
>
> Zona de alerta
>
> **Nota:** Para Raúl: la home tiene UN solo lead magnet, siguiendo StoryBrand: la calculadora (prototipo funcional ya hecho, te lo comparto aparte). El botón lleva a la calculadora, que pide nombre, correo y WhatsApp (opcional) con consentimiento Ley 8968 ANTES de mostrar el resultado. Envía a GHL el tag lead-calculadora y los campos personalizados "meses" y "zona", que usa la secuencia de 6 correos. El ebook se entrega en el correo 1, no en la web. No hay biblioteca de recursos: la calculadora es el único recurso gratis del sitio.
>
> 10 · CTA directo + plan de compra — nuevo
>
> Mentoría Wealth Mastery
>
> ¿Querés trabajar directamente conmigo?
>
> Imaginá saber exactamente con cuánto contás, tener tu dinero trabajando a tu favor y, cuando estés con tu familia, estar ahí de verdad.
>
> 1
>
> Aplica
>
> Una breve aplicación de 5 minutos.
>
> 2
>
> Llamada inicial conmigo
>
> Vemos dónde estás y si Wealth Mastery es para vos.
>
> 3
>
> Empezamos tu plan
>
> Definimos tu Norte y arrancamos con tu sistema.
>
> Aplicá a Wealth Mastery
>
> **Nota:** Para Raúl: la aplicación a Wealth Mastery también va a GHL (formulario o encuesta de GHL con tag aplicacion-vip), y al terminar lleva directo al calendario de GHL para agendar la llamada inicial. Gaby recibe una notificación con cada aplicación.
>
> Gaby Kelly
>
> Del mundo corporativo a tu libertad financiera.
>
> Gaby Kelly es inversora y mentora; no es asesora financiera. El contenido es educativo y no constituye una recomendación de inversión. Tus datos protegidos según la Ley 8968.
>
> Aviso de privacidad
>

## 4 · Calculator prototype (`calculadora-meses-de-libertad.html`)

### 4.1 Page text

> Gaby Kelly · Diagnóstico gratuito
>
> ¿Cuántos meses podrías sostenerte si cambiara tu puesto?
>
> Cinco datos, tres minutos. Descubrí cuánto tiempo te da hoy tu dinero sin tu salario.
>
> Tus números
>
> USD
>
> Colones
>
> Ya viene con un ejemplo cargado. Cambialo por tus números.
>
> ¿Cuánto gastás al mes para vivir como vives hoy?
>
> $
>
> Casa, comida, colegios, carro, seguros, salidas. Todo.
>
> ¿Cuánto tenés en cuentas de ahorro y billeteras?
>
> $
>
> ¿Cuánto tenés en inversiones que podrías vender en menos de un mes?
>
> $
>
> Fondos, acciones, ETFs, CDPs. No incluyás tu casa.
>
> ¿Cuánto tenés en la asociación solidarista?
>
> $
>
> Lo que recibirías si dejaras la empresa. Si no sabés, poné 0.
>
> ¿Cuánto te entra al mes sin trabajar?
>
> $
>
> Alquileres, dividendos, intereses.
>
> ¿Qué parte de tus inversiones está en acciones de tu empresa?
>
> No tengo acciones de mi empresa
>
> Menos del 20%
>
> Entre 20% y 50%
>
> Más del 50%
>
> Escribí cuánto gastás al mes para poder calcular.
>
> Calcular mis meses
>
> Tu resultado está listo
>
> ¿A dónde te lo enviamos? También te llega la guía "Cómo empezar a invertir siendo ejecutivo".
>
> Nombre
>
> Correo
>
> WhatsApp (opcional)
>
> Acepto recibir mi resultado y contenido de Gaby Kelly por correo y WhatsApp. Puedo darme de baja cuando quiera. Mis datos se protegen según la Ley 8968.
>
> Prototipo: este formulario no envía ni guarda nada. En la web real se conecta a GHL con el tag lead-calculadora.
>
> Ver mi resultado
>
> Tus meses de libertad
>
> 0
>
> Zona
>
> 0
>
> 6
>
> 12
>
> 24
>
> 36+ meses
>
> Dinero disponible sin tu salario
>
> Lo que te falta cubrir cada mes
>
> Ojo con la concentración. Una parte grande de tus inversiones está en tu propia empresa. Si a la empresa le va mal, podrías perder salario y ahorros al mismo tiempo.
>
> ¿Cómo subo este número?
>
> Con un sistema: billeteras, los beneficios de tu empresa trabajando para vos y un plan de inversión. Es lo que construimos juntos en Wealth Mastery, con el Método Polaris.
>
> Aplicá a Wealth Mastery
>
> Calcular otra vez
>
> Este cálculo es una estimación educativa con los datos que ingresaste. No incluye impuestos, comisiones ni cambios en tus gastos, y no constituye una recomendación de inversión. Gaby Kelly es inversora y mentora; no es asesora financiera.
>

### 4.2 Text set by the prototype's script

Validation messages:

> Escribí cuánto gastás al mes para poder calcular.
>
> Escribí tu nombre.
>
> Revisá tu correo: parece incompleto.
>
> Marcá la casilla para recibir tu resultado.

Zones (label, colour, title, message), as the prototype defines them:

| Months | Label | Colour | Title | Message |
|---|---|---|---|---|
| below 3 | Zona crítica | `#C98368` | Tu tranquilidad depende de tu próximo salario. | Si mañana cambiara tu puesto, tendrías menos de tres meses de margen. La buena noticia: con un buen salario, este número puede crecer rápido cuando tenés un sistema. |
| 3 to below 6 | Zona de alerta | `#E0A98F` | Tenés un colchón, pero es delgado. | Podrías sostenerte unos meses, pero un cambio en tu trabajo te obligaría a decidir desde la presión. El siguiente paso es separar con propósito cada mes. |
| 6 to below 12 | Base en construcción | `#D6B04D` | Vas bien. Ahora toca ponerlo a trabajar. | Tenés una base real. El reto es que ese dinero no se quede quieto: que empiece a generar ingresos para que no todo dependa de tu salario. |
| 12 to below 36 | Camino a la libertad | `#D8C5B1` | Tenés margen para decidir con calma. | Podés tomar decisiones de carrera desde la libertad. El siguiente nivel es que tus inversiones paguen una parte creciente de tus gastos. |
| 36 or more | Colchón sólido | `#D8C5B1` | Tu dinero ya te da años de tranquilidad. | Tenés más de tres años de margen. La pregunta ahora es si ese patrimonio está trabajando todo lo que podría y bien diversificado. |
| covered (no monthly gap) | Libre financieramente | `#D6B04D` | Tus ingresos pasivos ya cubren tus gastos. | Ganaste el juego: tus inversiones pagan tu vida. Ahora se trata de proteger y hacer crecer ese patrimonio. |

### 4.3 Behaviour of the prototype

- Money fields accept whole numbers only and show thousands with a point (`4.500`). The page loads with an example filled in: expenses 4.500, savings 9.000, investments 6.000, solidarista 5.000, passive income 0, and "Entre 20% y 50%" selected.
- A USD / Colones toggle converts every figure at a fixed rate of 500 colones per dollar and changes the currency symbol.
- Step 1 needs only the monthly expenses (more than 0); the other figures default to 0.
- Step 2 asks for name, email and optional WhatsApp, and one checkbox (the text in 4.1) before showing the result. It stores and sends nothing.
- Step 3 shows the months (one decimal with a comma below 10, rounded to the nearest; rounded to a whole number from 10; "mes" when the rounded value is exactly 1), the zone, the zone's title and message, a gauge from 0 to 36+ months (scale 0, 6, 12, 24, 36+), the available money and the monthly gap in the chosen currency, and the concentration alert when "Entre 20% y 50%" or "Más del 50%" was chosen. Its gold button "Aplicá a Wealth Mastery" links to gabykelly.com; "Calcular otra vez" goes back to step 1.

## 5 · Screen recording (`calculador_de_pagina_web.mp4`)

13 seconds, no narration: the prototype at a narrow width, scrolled from the questions to the result and back. In the recording all three steps are visible at once and the result reads "0" with an empty zone before anything is calculated. That is a fault of the prototype's style sheet (the cards' `display` overrides the `hidden` attribute), not intended behaviour: Gaby's email and the prototype's script show one step at a time.

## 6 · GoHighLevel calendar embed (ADR-006, US-037)

> `<iframe src="https://api.leadconnectorhq.com/widget/booking/sd9LQ9IQXZb8ZyF2x2zw" allow="payment" style="width: 100%;border:none;overflow: hidden;" scrolling="no" id="sd9LQ9IQXZb8ZyF2x2zw_1795455796123"></iframe><br><script src="https://link.msgsndr.com/js/form_embed.js" type="text/javascript"></script>`

The booking widget's URL (`PUBLIC_SCHEDULER_URL`) is `https://api.leadconnectorhq.com/widget/booking/sd9LQ9IQXZb8ZyF2x2zw`; the embed script loads from a second GoHighLevel host, `link.msgsndr.com`. The URL is public (anyone who books sees it); it is not a secret.

## 7 · How these sources were taken (2026-11-23)

- The three HTML files are saved in Windows-1252, not UTF-8. They were converted for reading; characters that Windows-1252 cannot hold had already been replaced with `?` in the files themselves. They are restored here from Gaby's email and the context: `→` in "Leé mi historia completa →", "Conocé Wealth Mastery →" and the notes; `…` in "Es para vos si…", "No es para vos si…", "Si nada cambia, en cinco años…" and "cambiara…"; `—` between each section's number and its mark; `∞` for the covered result (her email); `₡` for the colones symbol. Every other character is verbatim.
- The quotes follow the order of each page; buttons and labels are separate lines; identical lines repeated in a row are kept once.
- The calculator's zone texts and messages (4.2) come from its script; its behaviour (4.3) was read from the script and checked against the recording.

## 8 · The human owner's decisions (2026-11-23)

The coordinator compared these sources with the current spec (v0.6.1), the contract (1.2.1) and the owner's earlier direction, and put six points to the owner. The owner answered "go with your recommendations, for number 4 we need a good explanation for her to approve. On 6, leave hers but also explain to her with a good explanation about your conclusion". So:

**Adopted as Gaby asks (content):** voseo across the whole site; "Wealth Mastery" replaces "Mentoría VIP", and every VIP button reads "Aplicá a Wealth Mastery"; the new menu; the Wealth Mastery page with its eight sections, which replaces the Método Polaris page (US-028); the Método Polaris as three unnumbered pillars worked in parallel; the calculator as the only free resource, so the resource library (US-024) and the two library links are removed; her calculator's formula, zones, texts, currencies and concentration alert, replacing the placeholder formula (FR-034).

1. **Consent: two checkboxes, not one.** The prototype has one checkbox for both the result and Gaby's content by email and WhatsApp. The owner's decision of 2026-11-08 stands: a required consent for storing the lead and sending the result, and a separate, optional, unticked consent for Gaby's follow-up emails. Ley 8968 asks for consent per purpose; marketing by WhatsApp is not part of the funnel (FR-037), so the consent texts do not offer it.
2. **GoHighLevel holds the leads for Gaby's follow-up, through its API.** Our forms and the Google Sheet stay the record; after each successful save the backend also creates or updates the contact in GoHighLevel with the tag `lead-calculadora` (calculator) or `aplicacion-vip` (Wealth Mastery application) and the custom fields. GoHighLevel sends the six-email sequence and Gaby's notification, and a booking in its calendar ends the sequence inside GoHighLevel. ADR-007 is decided as option C, and [ADR-008](../decisions/ADR-008_GOHIGHLEVEL_CONTACTS.md) records the integration. This updates the owner's direction of 2026-11-08 ("GHL replaces only the calendar"), which already welcomed sending the data to GoHighLevel through its API.
3. **The Wealth Mastery application stays the site's own form**, not a GoHighLevel form: it keeps the pre-screening, validation, consent and the sheet, and the API gives Gaby the same tag and notification.
4. **Only the result goes to GoHighLevel, not the figures:** months, zone, currency and the concentration alert (yes or no). The figures the visitor types stay in the browser and are never sent or stored (FR-035, data minimization). **Pending Gaby's confirmation:** the owner asked for an explanation she can approve; the coordinator drafted it, and the owner sends it. If she asks for the figures as well, that needs a change to the privacy notice and its own consent, through a docs PR.
5. **The exchange rate is configuration** (`PUBLIC_CRC_PER_USD`, default 500), not a daily rate from an outside service.
6. **The months are shown with Gaby's rounding** (one decimal rounded to the nearest below 10, a whole number from 10), and the zone is taken from the exact value. Near a zone's lower limit the number shown can be the limit itself while the zone is the one below (5.96 is shown as "6" in "Zona de alerta"; 11.6 as "12" in "Base en construcción"). The owner kept Gaby's rule and asked for the explanation to go to her; rounding down would keep number and zone consistent, and is a one-line change if she prefers it.

The coordinator's reply to Gaby's question (webhook or native form) goes with the explanations of points 4 and 6: the calculator lives in the site, and the backend creates the contact in GoHighLevel through its API, like a webhook.
