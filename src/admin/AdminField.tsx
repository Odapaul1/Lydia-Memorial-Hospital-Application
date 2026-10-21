interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  type?: "text" | "email" | "tel";
}

export function TextField({ label, value, onChange, placeholder, hint, type = "text" }: TextFieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input className="field-input" type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}

export function TextArea({ label, value, onChange, rows = 5, hint }: TextAreaProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea className="field-input field-textarea" rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function ItemControls({
  index,
  total,
  onMove,
  onRemove,
  removeLabel = "Remove",
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  removeLabel?: string;
}) {
  return (
    <div className="item-controls">
      <button type="button" className="admin-button admin-button-quiet" disabled={index === 0} onClick={() => onMove(index, index - 1)}>Move up</button>
      <button type="button" className="admin-button admin-button-quiet" disabled={index === total - 1} onClick={() => onMove(index, index + 1)}>Move down</button>
      <button type="button" className="admin-button admin-button-danger" onClick={onRemove}>{removeLabel}</button>
    </div>
  );
}

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

export const moveItem = <T,>(items: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};
