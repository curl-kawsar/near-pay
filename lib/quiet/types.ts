export type QuietInitOptions = {
  profilesPrefix: string;
  memoryInitializerPrefix: string;
  libfecPrefix?: string;
};

export type QuietTransmitter = {
  transmit: (payload: ArrayBuffer) => void;
};

export type QuietTransmitterOptions = {
  profile: string;
  onFinish: () => void;
  clampFrame?: boolean;
};

export type QuietReceiverOptions = {
  profile: string;
  onReceive: (payload: ArrayBuffer) => void;
  onCreateFail: (reason: string) => void;
  onReceiveFail: (numFails: number) => void;
};

export interface QuietAPI {
  init: (opts: QuietInitOptions) => void;
  addReadyCallback: (onReady: () => void, onFail?: (reason: string) => void) => void;
  transmitter: (opts: QuietTransmitterOptions) => QuietTransmitter;
  receiver: (opts: QuietReceiverOptions) => void;
  str2ab: (str: string) => ArrayBuffer;
  ab2str: (buf: ArrayBuffer) => string;
  mergeab: (a: ArrayBuffer, b: ArrayBuffer) => ArrayBuffer;
}

declare global {
  interface Window {
    Quiet?: QuietAPI;
  }
}

export const QUIET_PROFILE = "ultrasonic2";

export function parsePaymentPayload(raw: string): { id: string; message: string } {
  const dash = raw.indexOf("-");
  if (dash === -1) {
    return { id: raw, message: "" };
  }
  return {
    id: raw.slice(0, dash),
    message: raw.slice(dash + 1),
  };
}
