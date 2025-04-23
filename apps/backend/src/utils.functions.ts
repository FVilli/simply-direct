import * as crypto from 'crypto';

export function hash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('base64');
}

/**
 * "Quasi UID", questa funzione restituisce un identificativo quasi univoco di 8 caratteri.
 * L'univocità non è garantita su grosse quantità e lunghi periodi di tempo.
 */
export function QUID(): string {
  return crypto.randomUUID().substring(0, 8);
}


