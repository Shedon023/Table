import { NumberInput } from "@mantine/core";
import { useController, type FieldValues } from "react-hook-form";
import type { BaseFieldProps } from "../types/types";

export function NumberInputField<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: BaseFieldProps<T> & React.ComponentProps<typeof NumberInput>) {
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <NumberInput
      {...props}
      label={label}
      value={value ?? ""}
      onChange={(val) => onChange(Number(val))}
      error={error?.message}
      ref={ref}
    />
  );
}
