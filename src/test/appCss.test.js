import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// jsdom does no layout, so a real overflow check needs a browser. This guards
// the specific rule that caused the horizontal page scroll on narrow phones.
const css = readFileSync(resolve(__dirname, '../App.css'), 'utf8');

const rulesFor = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // A rule starts at the file start, or after a closing brace or comment.
  const re = new RegExp(`(^|\\}|\\*/)\\s*${escaped}\\s*\\{([^}]*)\\}`, 'g');
  return [...css.matchAll(re)].map((m) => m[2]);
};

describe('App.css table scrolling', () => {
  it('lets .table-responsive scroll instead of forcing overflow: visible', () => {
    const declarations = rulesFor('.table-responsive').join(';');

    // Overriding Bootstrap's overflow-x: auto makes wide tables stretch the
    // whole page on small screens instead of scrolling inside their box.
    expect(declarations).not.toMatch(/overflow(-x)?\s*:\s*visible/);
  });
});
