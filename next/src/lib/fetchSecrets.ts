type SecretValues = Record<string, string>;

/**
 * Google Secret Manager 未使用環境のダミー関数
 * 本番で使用する場合は GCP 認証を再度有効化してください。
 */
async function getSecretValues(secretNames: string[]): Promise<SecretValues> {
  console.warn("[fetchSecrets] Google Secret Manager は現在無効化されています。");
  return secretNames.reduce((acc, secretName) => {
    const value = process.env[secretName];
    return { ...acc, [secretName]: value || "" };
  }, {} as SecretValues);
}

export async function fetchSecrets(secretNames: string[]): Promise<SecretValues> {
  return getSecretValues(secretNames);
}

export async function fetchSecret(secretName: string): Promise<string> {
  const secrets = await getSecretValues([secretName]);
  return secrets[secretName] || "";
}
