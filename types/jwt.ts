/*
 * TOKEN Creation Payloads
 */

export type TokenTypes = "access" | "refresh" | "recover";

export interface TokenPayload {
  phone: string;
  type: TokenTypes;
}

/*
 * TOKEN Decoded Payloads
 */

export interface GenericJwtDecoded {
  iat: number;
  exp: number;
}

export interface TokenDecoded extends TokenPayload, GenericJwtDecoded {}
