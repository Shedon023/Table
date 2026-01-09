import { useState } from "react";
import { Pagination, Modal, Button, Group } from "@mantine/core";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsersTable } from "./UsersTable";
import type { Column, UserDTO } from "../types/types";
import { userSchema, type UserFormInput, type UserFormOutput } from "../schema/schema";
import { Text } from "@mantine/core";
import { useGetUsers } from "../hooks/useGetUsers";
import { TextInputField } from "../form-fields/TextInputField";
import { NumberInputField } from "../form-fields/NumberInputField";
import { DatePickerField } from "../form-fields/DatePickerFIeld";
import { SelectField } from "../form-fields/SelectField";
import { getUserById } from "../hooks/useGetUserById";

export function UsersPage() {
  const { data, setUsers, isLoading, isError, limit, page, setPage, total, refetch } = useGetUsers(1, 10);

  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const {
    control,
    handleSubmit,
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

  const handleEditClick = async (user: UserDTO) => {
    try {
      setModalOpened(true);
      setEditingUser(user);

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

  const columns: Column<UserDTO>[] = [
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
  ];

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

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Text fw={700} size='xl'>
            Edit User
          </Text>
        }>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField<UserFormInput> name='firstName' label='First name' control={control} />
          <TextInputField<UserFormInput> name='lastName' label='Last name' control={control} />
          <TextInputField<UserFormInput> name='maidenName' label='Maiden name' control={control} />

          <NumberInputField<UserFormInput> name='age' label='Age' control={control} />

          <SelectField<UserFormInput> name='gender' label='Gender' control={control} data={["male", "female"]} />

          <TextInputField<UserFormInput> name='username' label='Username' control={control} />
          <TextInputField<UserFormInput> name='password' label='Password' control={control} />

          <DatePickerField<UserFormInput> name='birthDate' label='Birth date' control={control} />

          <Group mt='md' style={{ justifyContent: "flex-end" }}>
            <Button color='grape' type='submit' loading={isSubmitting}>
              Save
            </Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
}
