import { Select } from "@mantine/core";
import { useController, type FieldValues } from "react-hook-form";
import type { BaseFieldProps } from "../types/types";

export function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: BaseFieldProps<T> & React.ComponentProps<typeof Select>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return <Select {...props} {...field} label={label} error={error?.message} />;
}
