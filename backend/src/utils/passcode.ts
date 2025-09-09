export function isValidUploadPasscode(input: string): boolean {
  const list = process.env.UPLOAD_PASSCODES || process.env.UPLOAD_PASSCODE || '';
  if (!list) return false;
  const normalize = (s: string) => s.trim().toUpperCase();
  const allowed = list.split(',').map(normalize).filter(Boolean);
  const candidate = normalize(input || '');
  return allowed.includes(candidate);
}
