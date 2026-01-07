import { DatePickerInput } from "@mantine/dates";
import { useController, type FieldValues } from "react-hook-form";
import type { BaseFieldProps } from "../types/types";

export function DatePickerField<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: BaseFieldProps<T> & React.ComponentProps<typeof DatePickerInput>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <DatePickerInput
      {...props}
      label={label}
      value={value ? new Date(value) : null}
      onChange={(date) => onChange(date ? date.toString() : "")}
      valueFormat='DD/MM/YYYY'
      error={error?.message}
    />
  );
}
