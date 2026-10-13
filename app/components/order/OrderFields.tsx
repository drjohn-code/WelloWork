"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { CheckIcon } from "./OrderIcons";

/** Label + control + hint + error, with the a11y wiring done once. */
export function OrderTextField({
  id,
  label,
  error,
  hint,
  prefix,
  ...input
}: {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  prefix?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "prefix">) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="order-field">
      <label htmlFor={id}>{label}</label>
      <div className={`order-input ${prefix ? "has-prefix" : ""} ${error ? "invalid" : ""}`}>
        {prefix && (
          <span className="order-input-prefix" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input id={id} aria-invalid={Boolean(error)} aria-describedby={describedBy} {...input} />
      </div>
      {hint && (
        <span id={`${id}-hint`} className="order-hint">
          {hint}
        </span>
      )}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  return (
    <span id={id} className="order-error" role="alert">
      {error}
    </span>
  );
}

/** A selectable card backed by a real radio input, so arrow keys and screen readers work natively. */
export function ChoiceCard({
  id,
  name,
  checked,
  onSelect,
  children,
  badge,
  className = "",
  describedBy,
}: {
  id: string;
  name: string;
  checked: boolean;
  onSelect: () => void;
  children: ReactNode;
  badge?: string;
  className?: string;
  describedBy?: string;
}) {
  return (
    <label htmlFor={id} className={`order-card-choice ${checked ? "selected" : ""} ${className}`}>
      <input
        id={id}
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        aria-describedby={describedBy}
      />
      {badge && <span className="order-card-badge">{badge}</span>}
      <span className="order-card-check" aria-hidden="true">
        <CheckIcon size={12} />
      </span>
      {children}
    </label>
  );
}

/** 3-option segmented control (radio group) sized to match the 48px inputs. */
export function SegmentedRadio<T extends string>({
  name,
  idPrefix,
  options,
  value,
  onChange,
  labelledBy,
  describedBy,
  invalid,
}: {
  name: string;
  idPrefix: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: string;
  onChange: (value: T) => void;
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={`order-segmented ${invalid ? "invalid" : ""}`}
    >
      {options.map((o) => (
        <label key={o.value} htmlFor={`${idPrefix}-${o.value}`} className={value === o.value ? "selected" : ""}>
          <input
            id={`${idPrefix}-${o.value}`}
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

export function OrderCheckbox({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="order-check-field">
      <label htmlFor={id} className={`order-check ${error ? "invalid" : ""}`}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          aria-required="true"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="order-check-box" aria-hidden="true">
          <CheckIcon size={13} />
        </span>
        <span className="order-check-text">{children}</span>
      </label>
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}
