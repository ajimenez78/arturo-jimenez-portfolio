'use client';

import { Printer } from 'lucide-react';

export function PrintButton({ label }: { label: string }) {
  return <button className="button button-outline" onClick={() => window.print()}><Printer size={16}/>{label}</button>;
}
