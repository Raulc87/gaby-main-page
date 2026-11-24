# Lista de prueba: el sitio demo, paso a paso

Para Gaby. Versión 1, 2026-11-24. Hecha para la prueba funcional del sitio nuevo (US-047, [ADR-009](../decisions/ADR-009_DEMO_ENVIRONMENT.md)).

Con esta lista vas a usar el sitio como lo usaría una persona de verdad: la calculadora, la aplicación a Wealth Mastery y la reserva de una llamada. Vas a ver cómo llegan los contactos a tu GoHighLevel, con sus etiquetas, y, si tus flujos de trabajo ya están activos, los correos. Con lo que veas decidís si el sitio nuevo reemplaza al de gabykelly.com. Toma unos 40 minutos.

Es una **demo privada**: no es gabykelly.com, nadie más entra, y todo lo que escribás se guarda de verdad en una hoja de prueba y en tu cuenta de GoHighLevel. Por eso usás solo **datos de prueba**, y al final los borrás (paso 9).

## Lo que necesitás antes de empezar

| Qué | Detalle |
|---|---|
| La dirección | `https://gabydemo.digitalstrike-solutions.com/`. Abrila siempre escribiendo `https://` al principio |
| Usuario y contraseña | Te llegan aparte, en otro mensaje. El navegador los pide al entrar: es normal, la demo es privada |
| Cuatro correos de prueba, uno distinto para cada prueba (y un quinto si hacés el paso 8) | Si tu correo es `nombre@gmail.com`, podés usar `nombre+prueba1@gmail.com`, `nombre+prueba2@gmail.com`, `nombre+prueba3@gmail.com` y `nombre+prueba4@gmail.com`: todos llegan a tu misma bandeja. Nunca el correo de una clienta o de un cliente |
| Dos teléfonos de prueba, uno para cada aplicación | `+50600000003` para la prueba 3 y `+50600000004` para la prueba 4: no son números de nadie. Antes de empezar, buscá cada uno en **Contacts** de tu GoHighLevel: si ya hay un contacto con ese número, usá otro que no esté en tu cuenta. Nunca tu número ni el de una persona real: GoHighLevel reconoce a un contacto también por su teléfono, y la prueba podría cambiar o mezclar contactos de verdad |
| Tu GoHighLevel abierto en otra pestaña | Para los pasos 4, 6 y 7 |
| Un papel o un documento para anotar | Si algo no se ve como dice acá, anotá el paso, qué viste y la hora, y sacá una captura de pantalla |

Dos cosas que ayudan a entender lo que vas a ver:

- **Un correo distinto para cada prueba.** GoHighLevel reconoce a cada persona por su correo. Si repetís el correo, se actualiza el mismo contacto y las etiquetas que ya tenía se quedan. Con un correo distinto por prueba, cada contacto muestra solo lo que hizo esa prueba.
- **Hay un límite contra los robots.** Si ves "Recibimos varios intentos seguidos desde tu conexión", esperá diez minutos y seguí. No es un error de las pruebas.

Cada paso dice **qué hacer** y **qué deberías ver**.

## Paso 1. La calculadora en dólares, con los dos permisos

**Qué hacer**

1. Entrá a la dirección con el usuario y la contraseña, y abrí «Diagnóstico gratis» en el menú, o la página `/es/calculadora/`.
2. Dejá la moneda en **USD**. Los números del ejemplo ya vienen cargados: dejalos.
3. En «¿Qué parte de tus inversiones está en acciones de tu empresa?» elegí **«Más del 50%»**.
4. Tocá **«Calcular mis meses»**.
5. En «Tu resultado está listo», escribí el nombre completo **Prueba Uno**, el **correo de prueba 1** y dejá el WhatsApp vacío (es opcional).
6. Marcá **los dos casilleros**: el del tratamiento de datos y el de recibir los correos de Gaby.
7. Tocá **«Ver mi resultado»**.

**Qué deberías ver**

- El resultado: «Tus meses de libertad», con **4,4 meses** y la **Zona de alerta**.
- El aviso «Ojo con la concentración.», porque elegiste más del 50% en acciones de tu empresa.

## Paso 2. La calculadora en colones, solo con el permiso obligatorio

**Qué hacer**

1. Abrí de nuevo la calculadora desde «Diagnóstico gratis» en el menú. No uses «Calcular otra vez»: ese botón conserva los datos y los casilleros de la prueba anterior.
2. Cambiá la moneda a **Colones**.
3. En la pregunta de las acciones elegí **«No tengo acciones de mi empresa»** y tocá «Calcular mis meses».
4. Revisá que el nombre y el correo estén vacíos y que **los dos casilleros estén sin marcar**. Escribí el nombre **Prueba Dos** y el **correo de prueba 2**. Dejá el WhatsApp vacío.
5. Primero tocá **«Ver mi resultado»** sin marcar nada.
6. Ahora marcá **solo el primer casillero** (el del tratamiento de datos) y dejá **sin marcar** el de recibir los correos de Gaby. Tocá «Ver mi resultado» otra vez.

**Qué deberías ver**

- Al cambiar a colones (punto 2), los números del ejemplo ya convertidos (los gastos pasan de $4.500 a ₡2.250.000).
- Al tocar «Ver mi resultado» sin marcar nada (punto 5): el resultado **no aparece** y un mensaje dice «Necesitamos tu aceptación para poder guardar tus datos.»
- Con el casillero obligatorio marcado (punto 6), el resultado: el mismo de antes, **4,4 meses** en la **Zona de alerta**, ahora con los importes en ₡ y **sin** el aviso de concentración.

## Paso 3. Una aplicación con una respuesta que califica

**Qué hacer**

1. Abrí «Wealth Mastery» en el menú y entrá a la aplicación, o abrí la página `/es/aplicar/`.
2. En «Aplicá a Wealth Mastery» escribí el nombre **Prueba Tres**, el **correo de prueba 3** y el **teléfono de prueba 3** (`+50600000003`).
3. En la pregunta sobre tu disposición a invertir elegí **«Quiero invertir si el programa es adecuado para mí.»**
4. Marcá el casillero del tratamiento de datos y tocá **«Enviar mi aplicación»**.

**Qué deberías ver**

- «¡Gracias por tu información!»
- Debajo, **tu calendario de GoHighLevel** para agendar la llamada inicial, con el nombre, el correo y el teléfono ya escritos. Si en lugar del calendario ves un aviso para escribir a un correo, anotalo: algo no cargó.

## Paso 4. Agendar la llamada de prueba

**Qué hacer**

1. En el calendario del paso 3, elegí un día y un horario libres y confirmá la reserva con los datos de **Prueba Tres**.
2. En tu GoHighLevel, abrí **Calendars** y buscá la cita.

**Qué deberías ver**

- La confirmación de tu calendario.
- En tu GoHighLevel, una cita de **Prueba Tres** en el día y el horario que elegiste.
- Dejala por ahora: la cancelás en el paso 9.

## Paso 5. Una aplicación con una respuesta que todavía no califica

**Qué hacer**

1. Volvé a la aplicación (`/es/aplicar/`).
2. Escribí el nombre **Prueba Cuatro**, el **correo de prueba 4** y el **teléfono de prueba 4** (`+50600000004`).
3. Elegí **«Solo estoy explorando por ahora.»**, marcá el casillero y tocá «Enviar mi aplicación».

**Qué deberías ver**

- «Gracias por contarnos dónde estás hoy.»
- **Sin calendario.** En su lugar, un botón azul que lleva a la calculadora.

## Paso 6. Los contactos y sus etiquetas en GoHighLevel

**Qué hacer:** en tu GoHighLevel abrí **Contacts** y buscá cada correo de prueba. Abrí el contacto y mirá sus etiquetas y sus campos personalizados.

**Qué deberías ver**

| Prueba | Etiquetas | Campos |
|---|---|---|
| 1. Calculadora en USD, con los dos permisos | `lead-calculadora`, `idioma-es`, `consentimiento-correos` | `meses` = 4,4 · `zona` = Zona de alerta · `moneda` = USD · `alerta_concentracion` = sí |
| 2. Calculadora en colones, solo el permiso obligatorio | `lead-calculadora`, `idioma-es`, y **no** `consentimiento-correos` | `meses` = 4,4 · `zona` = Zona de alerta · `moneda` = CRC · `alerta_concentracion` = no |
| 3. Aplicación que califica | `aplicacion-vip`, `idioma-es` | `preseleccion` = «Quiero invertir si el programa es adecuado para mí.» |
| 4. Aplicación que todavía no califica | `aplicacion-vip`, `idioma-es` | `preseleccion` = «Solo estoy explorando por ahora.» |

Cada contacto tiene el nombre y el correo que escribiste y, en las aplicaciones, su teléfono de prueba. Son cuatro contactos distintos: si dos pruebas aparecen mezcladas en un mismo contacto, anotalo con la hora.

Si falta un contacto, o tiene etiquetas o campos distintos, anotalo con la hora: quien administra la demo revisa la hoja de prueba y el registro del servidor para ver por qué.

## Paso 7. Los correos (solo si tus flujos de trabajo ya están activos)

**Qué hacer:** pasados unos minutos, revisá las bandejas de los correos de prueba 1 y 2 (y la carpeta de spam), y tus propias notificaciones.

**Qué deberías ver, si tus flujos están activos**

- **Pruebas 1 y 2:** el correo 1, con el resultado (y la guía, si ya la conectaste), en español.
- **Prueba 1** (aceptó los correos de Gaby): en GoHighLevel, el contacto entra a la secuencia de los correos siguientes. No hace falta esperar a que lleguen.
- **Prueba 2** (no aceptó): solo el correo 1, y no entra a la secuencia.
- **Pruebas 3 y 4:** tu aviso por cada contacto con `aplicacion-vip`.
- Todos los correos van a las direcciones de prueba, nunca a una persona real.

**Si todavía no los activaste,** no llega ningún correo. Es lo esperado: anotalo y listo.

## Paso 8. Una prueba en inglés (opcional)

**Qué hacer:** en el sitio tocá **ES | EN**, hacé la calculadora de nuevo con un **quinto correo de prueba** y marcá el casillero obligatorio.

**Qué deberías ver:** el sitio entero en inglés y el resultado en inglés. En GoHighLevel, el contacto tiene `idioma-en` en lugar de `idioma-es`, y el campo `zona` se escribe en español, como en las otras pruebas.

## Paso 9. Limpiar lo que hiciste

Cuando termines, borrá lo que hicieron las pruebas. Buscá por los correos de prueba, no por etiqueta: tus contactos reales pueden tener las mismas etiquetas.

1. **Primero las citas.** En GoHighLevel, **Calendars**: cancelá la cita de **Prueba Tres** y cualquier otra que hayas agendado con un correo de prueba.
2. **Después los contactos.** En **Contacts**, buscá cada correo de prueba, revisá que el nombre y el correo sean los de la prueba y que el contacto se creó hoy (columna de fecha de creación), y borrá el contacto. Si no coincide algo, o el contacto es una persona real, **no lo borres** y avisá.
3. **La hoja de prueba** la limpia quien administra la demo, con la lista de [`GOHIGHLEVEL.md`](GOHIGHLEVEL.md) sección 10.

**Qué deberías ver:** al buscar cada correo de prueba, GoHighLevel no encuentra ningún contacto, y tu calendario no tiene citas de las pruebas.

## Si algo no sale

| Qué ves | Qué hacer |
|---|---|
| El navegador pide el usuario y la contraseña una y otra vez | Revisá que escribiste bien el usuario y la contraseña, y que la dirección empieza con `https://` |
| «Recibimos varios intentos seguidos desde tu conexión» | Esperá diez minutos y seguí |
| «No pudimos guardar tu información» | Esperá unos minutos y probá otra vez. Si sigue, anotá la hora y avisá |
| En lugar del calendario, un aviso para escribir a un correo | Anotalo y avisá: el calendario no cargó |
| Cualquier otra cosa que no se vea como dice la lista | Anotá el paso, qué viste y la hora, sacá una captura y avisá |
