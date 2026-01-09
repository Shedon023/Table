import { useMemo, useState } from "react";
import { Pagination, Button } from "@mantine/core";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsersTable } from "./UsersTable";
import type { Column, UserDTO } from "../types/types";
import { userSchema, type UserFormInput, type UserFormOutput } from "../schema/schema";
import { useGetUsers } from "../hooks/useGetUsers";
import { getUserById } from "../hooks/useGetUserById";
import { EditUserModal } from "./EditUserModal";

export function UsersPage() {
  const { data, setUsers, isLoading, isError, limit, page, setPage, total, refetch } = useGetUsers(1, 10);

  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<UserFormInput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      maidenName: "",
      age: 0,
      gender: "male",
      username: "",
      password: "",
      birthDate: null,
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEditClick = async (user: UserDTO) => {
    try {
      setModalOpened(true);
      setEditingUser(user);
      setIsFormLoading(true);

      reset({
        firstName: "",
        lastName: "",
        maidenName: "",
        age: 0,
        gender: "male",
        username: "",
        password: "",
        birthDate: null,
      });

      const fullUser = await getUserById(user.id);

      reset({
        firstName: fullUser.firstName,
        lastName: fullUser.lastName,
        maidenName: fullUser.maidenName,
        age: fullUser.age,
        gender: fullUser.gender as "male" | "female",
        username: fullUser.username,
        password: fullUser.password,
        birthDate: new Date(fullUser.birthDate),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsFormLoading(false);
    }
  };

  const onSubmit: SubmitHandler<UserFormInput> = async (formData) => {
    if (!editingUser) return;

    const data = formData as UserFormOutput;

    const payload = {
      ...data,
      birthDate: data.birthDate ? data.birthDate.toISOString().split("T")[0] : undefined,
    };

    try {
      const res = await fetch(`https://dummyjson.com/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updatedUser: UserDTO = await res.json();

      setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)));

      await refetch();
      setModalOpened(false);
      setEditingUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<UserDTO>[] = useMemo(
    () => [
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
        render: (_value, row) => {
          const date = new Date(row.birthDate);
          return date.toLocaleDateString("ru-RU");
        },
      },
      {
        type: "actions",
        key: "actions",
        title: "Actions",
        render: (_, row) => (
          <Button color='grape' size='xs' onClick={() => handleEditClick(row)}>
            Edit
          </Button>
        ),
      },
    ],
    [handleEditClick]
  );

  if (isError) return <p>Error!</p>;

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: 50, gap: 30 }}>
      <UsersTable data={data} columns={columns} isLoading={isLoading} />

      {totalPages > 1 && (
        <Pagination
          value={page}
          onChange={setPage}
          total={totalPages}
          style={{ display: "flex", justifyContent: "center" }}
        />
      )}

      <EditUserModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        control={control}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        isFormLoading={isFormLoading}
      />
    </div>
  );
}
