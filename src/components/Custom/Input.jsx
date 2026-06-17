import React, { useId } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Input = React.forwardRef(
  (
    {
      id,
      name,
      label,
      type = "text",
      value,
      onChange,
      error,
      helperText,
      required,
      className = "",
      containerClassName = "",
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = error && typeof error === "string" ? `${inputId}-error` : undefined;
    const {
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...inputProps
    } = props;
    const describedBy = [errorId, !error ? helperId : undefined, ariaDescribedBy]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className={cn("space-y-1 text-right", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-slate-700"
          >
            {label}
            {required && (
              <span className="mr-1 text-red-600" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <SInput
          ref={ref}
          {...inputProps}
          id={inputId}
          name={name || inputId}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={error ? true : ariaInvalid}
          aria-describedby={describedBy}
          className={cn(
            "text-right",
            error
              ? "border-red-500 ring-1 ring-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
              : "",
            className,
          )}
        />

        {helperText && !error && (
          <p id={helperId} className="text-xs leading-5 text-slate-600">
            {helperText}
          </p>
        )}

        {error && typeof error === "string" && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-semibold leading-5 text-red-700"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

const SInput = React.forwardRef(({ className = "", type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-700 placeholder:text-slate-400 focus-visible:border-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
});

SInput.displayName = "SInput";

export { Input };
