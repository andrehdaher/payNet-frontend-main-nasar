const Input = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  ...props   // ✅ تصحيح
}) => {
  return (
    <div className="text-right">
      <label
        htmlFor={id}
        className="block mb-1 mr-3 text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <SInput
        name={id}
        {...props}   // ✅ props صارت موجودة
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`text-right focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 ${
          error ? "border-red-500 ring-1 ring-red-500" : ""
        }`}
      />
    </div>
  );
};

const SInput = ({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md 
          border border-foreground/50 bg-foreground/10 px-3 
          py-2 text-foreground text-base ring-offset-background 
          file:border-0 file:bg-transparent file:text-sm 
          file:font-medium file:text-foreground 
          placeholder:text-foreground focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-ring 
          focus-visible:ring-offset-2 disabled:cursor-not-allowed 
          disabled:opacity-50 md:text-sm transition-all duration-500 ${className}`}
      ref={ref}
      {...props}
    />
  );
};
SInput.displayName = "SInput";

export { Input };
