
export enum Mode {
  CITY_MAP = 'CITY_MAP',
  SPECIALTY_CRAFT = 'SPECIALTY_CRAFT'
}

export interface GenerationHistory {
  id: string;
  url: string;
  prompt: string;
  mode: Mode;
  timestamp: number;
}
