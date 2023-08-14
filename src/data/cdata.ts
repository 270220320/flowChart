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
  width?: number;
  state?: string;
  aniType?: string;
  outLineIds?: Array<string>;
  inLineIds?: Array<string>;
}
export interface thingTextInfo {
  v?: string;
  code?: string;
  label?: string;
  showLabel?: boolean;
  unit?: string;
  id?: string;
  btns?: string[];
  switchOpt?: {
    checkedLabel: string;
    checkedValue: string;
    unCheckedLabel: string;
    unCheckedValue: string;
  };
}

export interface CDATA {
  [key: string]: any;
  thing?: Thing;
  ii?: INTANCEINFO; // intance info
  lineInfo?: LINEINFO;
  thingTextInfo?: thingTextInfo;
  state?: string | number;
  showCard?: boolean;
}

export const cData: CDATA = {};
