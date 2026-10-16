// The typed resource list equals CONTENT.md section 7.3 and keeps the rule of
// US-024 AC3/AC4: no file is linked unless it exists in public/resources/.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  FEATURED_RESOURCE_ID,
  getResource,
  isResourcePending,
  RESOURCES,
  RESOURCE_TOPICS,
  RESOURCE_TYPES,
} from '../../../src/data/resources';

const root = join(__dirname, '..', '..', '..');
const content = readFileSync(join(root, 'docs/ux/CONTENT.md'), 'utf8');

/** Rows of the CONTENT.md section 7.3 table. */
const rows = content
  .split('\n')
  .map((line) => line.match(/^\| `([a-z-]+)` \| (\w+) \| (\w+) \| (\w+) \| (yes \((\d)\w+\)|no) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \| (?:approved|provisional) \|$/))
  .filter((match): match is RegExpMatchArray => match !== null);

describe('resource list (CONTENT.md section 7.3)', () => {
  it('has one entry per CONTENT.md row, in order', () => {
    expect(rows.length).toBeGreaterThan(0);
    expect(RESOURCES.map((resource) => resource.id)).toEqual(rows.map((row) => row[1]));
  });

  it('copies type, topic, access, home order, titles and descriptions verbatim', () => {
    for (const row of rows) {
      const resource = getResource(row[1]);
      expect(resource.type, row[1]).toBe(row[2]);
      expect(resource.topic, row[1]).toBe(row[3]);
      expect(resource.access, row[1]).toBe(row[4]);
      expect(resource.homeOrder, row[1]).toBe(row[6] ? Number(row[6]) : undefined);
      expect(resource.title.es, row[1]).toBe(row[7]);
      expect(resource.title.en, row[1]).toBe(row[8]);
      expect(resource.description.es, row[1]).toBe(row[9]);
      expect(resource.description.en, row[1]).toBe(row[10]);
    }
  });

  it('uses unique ids and only known types and topics', () => {
    expect(new Set(RESOURCES.map((resource) => resource.id)).size).toBe(RESOURCES.length);
    for (const resource of RESOURCES) {
      expect(RESOURCE_TYPES).toContain(resource.type);
      expect(RESOURCE_TOPICS).toContain(resource.topic);
    }
  });

  it('features the mini-course on debt', () => {
    expect(getResource(FEATURED_RESOURCE_ID).type).toBe('minicourse');
  });

  it('links a file only if it exists in public/resources/ (US-024 AC4)', () => {
    for (const resource of RESOURCES) {
      for (const lang of ['es', 'en'] as const) {
        const file = resource.file?.[lang];
        if (file) expect(existsSync(join(root, 'public', file)), `${resource.id} ${lang}`).toBe(true);
        expect(isResourcePending(resource, lang)).toBe(file === undefined);
      }
    }
  });

  it('has no delivered file yet, so every card is pending', () => {
    expect(RESOURCES.every((resource) => resource.file === undefined)).toBe(true);
  });
});
