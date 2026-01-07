import type { ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

export type UsersResponse = {
  users: UserDTO[];
  total: number;
  limit: number;
  skip: number;
};

export type UserDTO = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  username: string;
  password: string;
  birthDate: string;
};

export type Column<T> = {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

export type DataTableProps<T extends { id: number | string }> = {
  data: T[];
  columns: Column<T>[];
  emptyText?: string;
  isLoading: boolean;
};

export interface BaseFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
}
