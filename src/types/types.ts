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

export type DataColumn<T> = {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  type?: undefined; // обязательно, чтобы TS различал
};

export type ActionColumn<T> = {
  key: "actions";
  title: string;
  type: "actions";
  render: (_: null, row: T) => React.ReactNode;
};

export type Column<T> = DataColumn<T> | ActionColumn<T>;

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
