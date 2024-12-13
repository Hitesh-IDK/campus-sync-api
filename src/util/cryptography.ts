import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const randomFourDigits = (): string => {
  const newCode: string = crypto.getRandomValues(new Uint16Array(1)).join('');
  return newCode.length > 4 ? newCode.slice(1, 5) : newCode;
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 8);
};
