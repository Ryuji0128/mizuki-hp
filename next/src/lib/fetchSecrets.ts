export async function fetchSecret(secretName: string): Promise<string> {
  return process.env[secretName] || "";
}
