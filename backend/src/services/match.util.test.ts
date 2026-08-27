import { describe, it, expect } from 'vitest';
import { computeMatchScore, buildExplanation, type MatchPath } from './match.util';

describe('computeMatchScore', () => {
  it('returns 0 when there are no matches', () => {
    expect(computeMatchScore(0, 0)).toBe(0);
  });

  it('awards 15 points per skill match', () => {
    expect(computeMatchScore(1, 0)).toBe(15);
    expect(computeMatchScore(2, 0)).toBe(30);
    expect(computeMatchScore(4, 0)).toBe(60);
  });

  it('caps skill points at 60', () => {
    expect(computeMatchScore(5, 0)).toBe(60);
    expect(computeMatchScore(10, 0)).toBe(60);
  });

  it('awards 8 points per technology match', () => {
    expect(computeMatchScore(0, 1)).toBe(8);
    expect(computeMatchScore(0, 5)).toBe(40);
  });

  it('caps technology points at 40', () => {
    expect(computeMatchScore(0, 6)).toBe(40);
    expect(computeMatchScore(0, 20)).toBe(40);
  });

  it('combines skill and technology points', () => {
    expect(computeMatchScore(2, 2)).toBe(30 + 16);
  });

  it('caps the total at 100', () => {
    expect(computeMatchScore(4, 5)).toBe(Math.min(60 + 40, 100));
    expect(computeMatchScore(10, 20)).toBe(100);
  });

  it('handles the documented example boundary', () => {
    expect(computeMatchScore(4, 5)).toBe(100);
    expect(computeMatchScore(3, 4)).toBe(45 + 32);
  });
});

describe('buildExplanation', () => {
  it('returns the fallback message when nothing matches', () => {
    expect(buildExplanation('Ada', [], [], [])).toBe(
      'This candidate has relevant experience for this role.'
    );
  });

  it('explains direct skill matches', () => {
    const text = buildExplanation('Ada', ['Node.js', 'TypeScript'], [], []);
    expect(text).toContain('Ada has 2 required skills: Node.js, TypeScript.');
  });

  it('summarises more than 3 skills', () => {
    const text = buildExplanation('Ada', ['a', 'b', 'c', 'd'], [], []);
    expect(text).toContain('a, b, c and 1 more');
  });

  it('explains project path matches', () => {
    const paths: MatchPath[] = [
      { project: 'Gateway', domain: 'Fintech', technology: 'Node.js' },
      { project: 'Gateway', domain: 'Fintech', technology: 'Redis' },
    ];
    const text = buildExplanation('Ada', [], [], paths);
    expect(text).toContain('They also worked on Gateway');
    expect(text).toContain('Node.js, Redis');
  });

  it('handles technology-only matches without paths', () => {
    const text = buildExplanation('Ada', [], ['Kafka', 'AWS'], []);
    expect(text).toContain('Their project experience includes Kafka, AWS');
  });

  it('combines skills and project paths', () => {
    const paths: MatchPath[] = [
      { project: 'Gateway', domain: 'Fintech', technology: 'Node.js' },
    ];
    const text = buildExplanation('Ada', ['Node.js'], [], paths);
    expect(text).toContain('Ada has 1 required skill: Node.js.');
    expect(text).toContain('They also worked on Gateway');
  });
});
