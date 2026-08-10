export function formatSeconds(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const parts =
    hrs > 0
      ? [hrs, mins, secs]
      : [mins, secs];
  return parts.map((n) => String(n).padStart(2, "0")).join(":");
}

export function formatDateOnly(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().split("T")[0];
}
