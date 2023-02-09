import { Thing } from "./thing";

export interface INTANCEINFO {}
export interface LINEINFO {
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
}

export const cData: CDATA = {};
