import { Thing } from "./thing";

export interface INTANCEINFO {}
export interface LINEINFO {
  from?: string;
  fromExcursionX?: number;
  fromExcursionY?: number;
  to?: string;
  toExcursionX?: number;
  toExcursionY?: number;
  type?: string;
  state?: string;
  aniType?: string;
  outLineIds?: Array<string>;
  inLineIds?: Array<string>;
}
export interface thingTextInfo {
  v?: string;
  code?: string;
  label?: string;
  unit?: string;
}

export interface CDATA {
  [key: string]: any;
  thing?: Thing;
  ii?: INTANCEINFO; // intance info
  lineInfo?: LINEINFO;
  thingTextInfo?: thingTextInfo;
  state?: string | number;
}

export const cData: CDATA = {};
