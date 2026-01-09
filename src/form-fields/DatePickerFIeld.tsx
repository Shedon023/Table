import { DatePickerInput } from "@mantine/dates";
import { useController, type FieldValues } from "react-hook-form";
import type { BaseFieldProps } from "../types/types";
import "@mantine/dates/styles.css";

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
      value={value ?? null}
      onChange={onChange}
      valueFormat='DD/MM/YYYY'
      error={error?.message}
    />
  );
}
