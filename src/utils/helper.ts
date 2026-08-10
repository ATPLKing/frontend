export function generateID(): string {
  return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
