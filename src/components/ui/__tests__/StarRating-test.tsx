import { render } from '@testing-library/react-native';

import { StarRating } from '@/components/ui/StarRating';

type JsonNode = { type?: string; children?: (JsonNode | string)[] | null };

function glyphCodePoints(tree: unknown): number[] {
  const codePoints: number[] = [];

  function walk(node: JsonNode | string | null | undefined) {
    if (!node || typeof node === 'string') return;
    if (node.type === 'Text' && Array.isArray(node.children)) {
      for (const child of node.children) {
        if (typeof child === 'string' && child.length > 0) {
          codePoints.push(child.codePointAt(0) as number);
        }
      }
    }
    (node.children ?? []).forEach(walk);
  }

  walk(tree as JsonNode);
  return codePoints;
}

function filledCount(tree: unknown): number {
  const codePoints = glyphCodePoints(tree);
  const outlineGlyph = codePoints.length > 0 ? Math.max(...codePoints) : null;
  return codePoints.filter((code) => code !== outlineGlyph).length;
}

test('renders zero filled stars when rating is null', async () => {
  const { toJSON } = await render(<StarRating rating={null} count={5} />);

  expect(glyphCodePoints(toJSON())).toHaveLength(5);
  expect(new Set(glyphCodePoints(toJSON())).size).toBe(1);
});

test('renders zero filled stars when rating is undefined', async () => {
  const { toJSON } = await render(<StarRating rating={undefined} count={5} />);

  expect(new Set(glyphCodePoints(toJSON())).size).toBe(1);
});

test('rounds a fractional rating into filled stars', async () => {
  const { toJSON } = await render(<StarRating rating={3.6} count={5} />);

  expect(filledCount(toJSON())).toBe(4);
});
