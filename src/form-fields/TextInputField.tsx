import { TextInput } from "@mantine/core";
import { useController, type FieldValues } from "react-hook-form";
import type { BaseFieldProps } from "../types/types";

export function TextInputField<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: BaseFieldProps<T> & React.ComponentProps<typeof TextInput>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return <TextInput {...props} {...field} label={label} error={error?.message} />;
}
