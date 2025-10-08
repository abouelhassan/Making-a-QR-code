// Fix: Import ChangeEvent from React to resolve the "Cannot find namespace 'React'" error.
import type { ChangeEvent } from 'react';

export interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  type?: 'text' | 'email' | 'tel';
  as?: 'input' | 'textarea';
}

export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
}

export interface QRCodeDisplayProps {
  userData: UserData;
}