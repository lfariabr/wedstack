export function isValidUploadPasscode(input: string): boolean {
  const env = process.env.UPLOAD_PASSCODES || '';
  if (!env) return false;
  const allowed = env.split(',').map((s) => s.trim()).filter(Boolean);
  return allowed.includes(input);
}
