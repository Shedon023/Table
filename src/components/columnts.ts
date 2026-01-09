import type { Column, UserDTO } from "../types/types";

export const userColumns: Column<UserDTO>[] = [
  { key: "id", title: "ID" },
  { key: "firstName", title: "First name" },
  { key: "lastName", title: "Last name" },
  { key: "maidenName", title: "Maiden name" },
  { key: "age", title: "Age" },
  { key: "gender", title: "Gender" },
  { key: "username", title: "Username" },
  { key: "password", title: "Password" },
  {
    key: "birthDate",
    title: "Birth date",
    render: (_value, row) => new Date(row.birthDate).toLocaleDateString("ru-RU"),
  },
];
