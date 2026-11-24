# CONTENT — phase 2d copy (staged)

The phase 2d copy: Gaby's final content of 2026-11-23 ([`BRIEF_2026-11-23_WEALTH_MASTERY.md`](BRIEF_2026-11-23_WEALTH_MASTERY.md)), written as [`CONTENT.md`](CONTENT.md) rows, ready to move. It is staged here, not in `CONTENT.md`, because the unit tests check the code against `CONTENT.md`: each Sprint 005 story moves **its part** into `CONTENT.md` in the same PR as its code, and deletes that part from this file. The story that moves the last part deletes this file and the references to it.

Same rules as `CONTENT.md` (its Metadata): the row format is the same (`| key | Español | English | Status |`), values are verbatim and never contain markers, `*text*` marks the italic part of a heading, `= key` points at another key, and **every English value is provisional** until Gaby validates the English as a whole.

## Parts and who moves them

| Part | What | Moved by |
|---|---|---|
| [H](#part-h--home-the-three-pillars-and-no-library-links) | Home: the Método Polaris as three pillars (§5.6), the Wealth Mastery section removed (§5.7), the teaser's library links removed (§5.10) | US-043 |
| [L](#part-l--the-resource-library-withdrawn) | §7 withdrawn, and every key that pointed at the library; **after Part H** | US-046 |

Rules for the moves:

- **Part V (voseo, the name, the menu) has moved** (US-041, merged first in Sprint 005; it is in `CONTENT.md`). It gave interim voseo to keys that Parts H, W, C, P and L later replace or remove; each of those parts replaces those rows with its own. References below to "Part V" mean those moved rows.
- **No part depends on another part's move**, except **Part L, which moves after Part H**: until Part H, the Home's calculator teaser shows `home.calculator.more` and the titles of two resources from the data file Part L deletes (the same order as `docs/sprints/SPRINT_005.md`: `GK-046` after `GK-043`). Where two parts show the same text (the pillars on the Home and on the Wealth Mastery page), each writes it out in full; aliases (`= key`) point only at keys already in `CONTENT.md` after Part V.
- **Status.** `approved`: Gaby's Spanish, verbatim from the brief, or an approved value changed only by her two rules (voseo, the programme's name). `provisional`: proposed by the team, shown with the pending badge where `CONTENT.md` Metadata says so. Each part updates the Metadata's badge lists as its notes say.
- **Section numbers stay.** A section that is withdrawn keeps its heading with one line saying so, so references to other sections keep working.
- Gaby's few slips against her own rules are corrected here and listed for her in [Flags for Gaby](#flags-for-gaby).

---

## Part H — Home: the three pillars and no library links

**Moved by US-043.** Gaby's adjusted Home, section 6 (brief §3), verbatim.

### H.1 The plan: Método Polaris (§5.6), replaced

These rows replace the whole §5.6 table. `home.method.1.*` to `home.method.3.*` change meaning (pillars, not steps): each pillar has a `label` (the official name, shown small above), a `title` (the short name) and a `body`.

| Key | Español | English | Status |
|---|---|---|---|
| `home.method.eyebrow` | El Método Polaris | The Polaris Method | approved |
| `home.method.title` | Tres pilares que avanzan juntos, *con cada salario.* | Three pillars that move forward together, *with every paycheck.* | approved |
| `home.method.lead` | Polaris es la Estrella Polar: tu norte, el que guía el camino. Así nació mi método, de más de 10 años construyendo mi propio portafolio: un norte claro para que cada decisión con tu dinero vaya en la misma dirección. | Polaris is the North Star: your north, the one that guides the way. That's how my method was born, from more than 10 years building my own portfolio: a clear north so every decision with your money goes in the same direction. | approved |
| `home.method.1.label` | Mentalidad Millonaria | Millionaire Mindset | approved |
| `home.method.1.title` | Mentalidad | Mindset | approved |
| `home.method.1.body` | Tus creencias y patrones con el dinero, y la vida que querés construir. | Your beliefs and patterns with money, and the life you want to build. | approved |
| `home.method.2.label` | Administración del Dinero | Money Management | approved |
| `home.method.2.title` | Administración | Management | approved |
| `home.method.2.body` | Tu sistema de billeteras y tu protección: cada ingreso y cada beneficio con un propósito. | Your wallet system and your protection: every income and every benefit with a purpose. | approved |
| `home.method.3.label` | Inversiones e Ingresos Pasivos | Investments and Passive Income | approved |
| `home.method.3.title` | Inversión | Investing | approved |
| `home.method.3.body` | Bolsa, bienes raíces, oro, plata y cripto: entender, evaluar y decidir. | Stocks, real estate, gold, silver and crypto: understand, evaluate and decide. | approved |
| `home.method.closing` | No es primero una cosa y después la otra: con cada ingreso avanzás en los tres al mismo tiempo. | It isn't one thing first and then the other: with every income you move forward in all three at the same time. | approved |
| `home.method.cta` | = `cta.vip_apply` | = `cta.vip_apply` | approved |
| `home.method.link` | Conocé Wealth Mastery | Get to know Wealth Mastery | approved |

The note under §5.6 becomes: "Gaby's official pillars (2026-11-23). They are worked in parallel, so they show no numbers, no arrows and no order (`UX_UI_DIRECTION.md` §5.1). `home.method.cta` (blue, BR-010) leads to the application page; `home.method.link` is a text link to the Wealth Mastery page (§12), its arrow drawn by the link style." `home.method.cta` was "Quiero aplicar el Método Polaris con Gaby"; Gaby's section has the apply button instead. US-043 removes "the Método Polaris steps (§5.6)" from the Metadata's provisional blocks.

### H.2 What you learn in Wealth Mastery (§5.7), removed

The §5.7 section and all its keys (`home.mastery.*`) are removed: Gaby moved it to the Wealth Mastery page, which explains each pillar (FR-032 withdrawn). The §5.7 heading stays with one line: "Withdrawn in phase 2d (US-043): the Wealth Mastery page (§12) explains the pillars." US-043 removes "the Wealth Mastery modules (§5.7)" from the Metadata's provisional blocks, and the §5 intro says ten sections (the list without "Wealth Mastery").

### H.3 The calculator teaser (§5.10)

`home.calculator.more` is **removed**, with its two links; the note under §5.10 drops its sentence about them ("Below `home.calculator.more`…"). No other §5.10 row changes beyond Part V.

---

## Part L — The resource library withdrawn

**Moved by US-046, after Part H** (US-043 removes the Home teaser's library links first). Gaby: one free resource, the calculator (brief §1 point 1).

### L.1 Removed

- **§7** (all of 7.1, 7.2 and 7.3) and the resource data file. The heading stays with one line: "## 7. Free resources — withdrawn in phase 2d (US-046): the calculator (§11) is the site's only free resource."
- `meta.resources.*` (§1), `nav.resources` if Part V has not removed it, `cta.all_resources` and `vip_band.short_title` (§4), and `calc.result.secondary` (§11) if Part C has not removed it.
- The §4 note's sentence "the resource library uses `vip_band.short_title`".
- In the Metadata: the resource cards from the placeholders and the provisional blocks, and `resources.filter.label`, `resources.empty`, `resource.pending`, `resource.email.coming_soon` and `resource.cover_alt` from the no-badge list.

### L.2 Changed

| Key | Español | English | Status |
|---|---|---|---|
| `story.resources_link` | O empezá gratis: calculá tus meses de libertad | Or start free: calculate your months of freedom | provisional |
| `thanks.not_ready.body` | Es posible que te contactemos por correo electrónico o WhatsApp. Cuando sea tu momento, aquí estaremos. Mientras tanto, podés empezar gratis: descubrí cuántos meses podrías sostenerte hoy. | We may reach out by email or WhatsApp. When the time is right for you, we'll be here. In the meantime, you can start for free: find out how many months you could sustain yourself today. | provisional |
| `thanks.not_ready.more` | = `home.hero.secondary` | = `home.hero.secondary` | approved |

- `cta.start_free` is **removed**; `story.resources_link` gets its own value and links to the calculator (US-046 AC2). The key keeps its name so the My story code does not move.
- The not-ready screen shows the blue `thanks.not_ready.more` button to the calculator, not the mini-course card (`UX_UI_DIRECTION.md` §6.4); the note under §8.5 becomes "Below `thanks.not_ready.body`, the blue `thanks.not_ready.more` button leads to the calculator (§11)."

---

## Flags for Gaby

For the owner to send with the next message to Gaby; none blocks Sprint 005 (the rows above are what ships until she answers).

1. **Two slips against her own voseo rule, corrected:** "Tu libertad depende de un puesto que no **controlas**" → "controlás" (Home, stakes); "**Aplica**" → "Aplicá" (Home, closing step 1); "para vivir como **vives** hoy" → "vivís" (calculator, first question).
2. **Gender-neutral wording (project rule BR-005), three lines adapted, provisional until she confirms:** "Querés hacerte **rico** rápido o aprender trading." → "Querés enriquecerte rápido o aprender trading."; "No estás **dispuesto** a cambiar hábitos con tu dinero." → "No tenés la disposición de cambiar hábitos con tu dinero."; "Al terminar seguís **acompañado** por otras personas…" → "Al terminar seguís en compañía de otras personas…".
3. **"Norte" or "norte":** the Home's closing step says "Definimos tu **Norte**" and the Wealth Mastery page "Definimos tu **norte**"; both pages show the same steps, so one spelling is used, the Home's capital N, until she chooses.
4. **The problem section:** her final Home brings back "Cada vez más cosas dependen de vos, y" that she had called redundant in November; her final text is used.
5. **The number of people mentored** ("[X]" in her Home) stays "200+" (from gabykelly.com today), provisional until she confirms it.
6. **The narrow header button** reads "Aplicá" on phones, because "Aplicá a Wealth Mastery" does not fit there.
7. **The FAQ answers** carry the "pending validation" badge until she confirms them (her note).
8. **The English** of all the new text is the team's translation, provisional until she reviews it.
