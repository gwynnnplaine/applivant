export function seconds(n: number): number {
  return n;
}

export function minutes(n: number): number {
  return seconds(n * 60);
}

export function hours(n: number): number {
  return minutes(n * 60);
}

export function days(n: number): number {
  return hours(n * 24);
}

export function weeks(n: number): number {
  return days(n * 7);
}

export function years(n: number): number {
  // Approximation, not accounting for leap years
  return days(n * 365);
}
