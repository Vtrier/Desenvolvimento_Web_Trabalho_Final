"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, type = "text", id, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-300"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (show ? "text" : "password") : type}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`
              w-full px-4 py-3 rounded-xl text-sm text-slate-100 placeholder:text-slate-500
              bg-white/5 border transition-all duration-150 outline-none
              focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50
              ${error ? "border-red-500/60 bg-red-500/5" : "border-white/10 hover:border-white/20"}
              ${isPassword ? "pr-12" : ""}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-red-400 mt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
