export type Screen = 'home' | 'profile' | 'docs' | 'id-card';

export interface ToastMessage {
  id: number;
  text: string;
}

export interface SheetData {
  title: string;
  type: string;
  detail?: string;
}
