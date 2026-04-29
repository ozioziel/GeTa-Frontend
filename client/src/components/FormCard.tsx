import '../styles/FormCard.css';
import type { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export default function FormCard({ children }: Props) {
  return <section className="form-card">{children}</section>;
}
