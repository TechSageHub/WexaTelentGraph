import type { MatchPath } from '../types';

/** Remove duplicate project + technology path entries. */
export function uniquePaths(paths: MatchPath[]): MatchPath[] {
  return paths.filter(
    (p, i, arr) =>
      arr.findIndex((x) => x.project === p.project && x.technology === p.technology) === i
  );
}
