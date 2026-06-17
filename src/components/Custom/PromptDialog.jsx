import { useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Input } from "./Input";

export default function PromptDialog({
  open,
  title,
  description,
  label,
  placeholder,
  inputType = "text",
  confirmText = "حفظ",
  tone = "default",
  loading = false,
  onConfirm,
  onClose,
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  return (
    <ConfirmDialog
      open={open}
      title={title}
      description={description}
      confirmText={confirmText}
      tone={tone}
      loading={loading}
      onClose={onClose}
      onConfirm={() => onConfirm(value)}
    >
      <Input
        id="prompt-value"
        label={label}
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        required
      />
    </ConfirmDialog>
  );
}
