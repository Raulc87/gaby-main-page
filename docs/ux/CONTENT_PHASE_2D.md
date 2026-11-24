# CONTENT — phase 2d copy (staged)

The phase 2d copy: Gaby's final content of 2026-11-23 ([`BRIEF_2026-11-23_WEALTH_MASTERY.md`](BRIEF_2026-11-23_WEALTH_MASTERY.md)), written as [`CONTENT.md`](CONTENT.md) rows, ready to move. It is staged here, not in `CONTENT.md`, because the unit tests check the code against `CONTENT.md`: each Sprint 005 story moves **its part** into `CONTENT.md` in the same PR as its code, and deletes that part from this file. The story that moves the last part deletes this file and the references to it.

Same rules as `CONTENT.md` (its Metadata): the row format is the same (`| key | Español | English | Status |`), values are verbatim and never contain markers, `*text*` marks the italic part of a heading, `= key` points at another key, and **every English value is provisional** until Gaby validates the English as a whole.

## Parts and who moves them

| Part | What | Moved by |
|---|---|---|
| [L](#part-l--the-resource-library-withdrawn) | §7 withdrawn, and every key that pointed at the library | US-046 |

Rules for the moves:

- **Part V (voseo, the name, the menu) has moved** (US-041, merged first in Sprint 005; it is in `CONTENT.md`). It gave interim voseo to keys that Parts H, W, C, P and L later replace or remove; each of those parts replaces those rows with its own. References below to "Part V" mean those moved rows.
- **No part depends on another part's move.** Part H (the Home) has moved (US-043), so the Home's calculator teaser no longer imports the resource data and Part L can move. Where two parts show the same text (the pillars on the Home and on the Wealth Mastery page), each writes it out in full; aliases (`= key`) point only at keys already in `CONTENT.md` after Part V.
- **Status.** `approved`: Gaby's Spanish, verbatim from the brief, or an approved value changed only by her two rules (voseo, the programme's name). `provisional`: proposed by the team, shown with the pending badge where `CONTENT.md` Metadata says so. Each part updates the Metadata's badge lists as its notes say.
- **Section numbers stay.** A section that is withdrawn keeps its heading with one line saying so, so references to other sections keep working.
- Gaby's few slips against her own rules are corrected here and listed for her in [Flags for Gaby](#flags-for-gaby).

---

## Part L — The resource library withdrawn

**Moved by US-046** (US-043 removed the Home teaser's library links first). Gaby: one free resource, the calculator (brief §1 point 1).

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
