import { useState } from "react";
import { Pagination, Modal, Button, Group } from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsersTable } from "./UsersTable";
import type { Column, UserDTO } from "../types/types";
import { userSchema, type UserFormValues } from "../schema/schema";
import { Text } from "@mantine/core";
import { useGetUsers } from "../hooks/useGetUsers";
import { TextInputField } from "../form-fields/TextInputField";
import { NumberInputField } from "../form-fields/NumberInputField";
import { DatePickerField } from "../form-fields/DatePickerFIeld";
import { SelectField } from "../form-fields/SelectField";
import { getUserById } from "../hooks/useGetUserById";

export function UsersPage() {
  const { data, setUsers, isLoading, isError, limit, page, setPage, total } = useGetUsers(1, 10);

  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      maidenName: "",
      age: 0,
      gender: "male",
      username: "",
      password: "",
      birthDate: "",
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
        birthDate: fullUser.birthDate,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (formData: UserFormValues) => {
    if (!editingUser) return;

    try {
      const res = await fetch(`https://dummyjson.com/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updatedUser: UserDTO = await res.json();

      setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)));

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
    { key: "birthDate", title: "Birth date" },
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
          <TextInputField<UserFormValues> name='firstName' label='First name' control={control} />
          <TextInputField<UserFormValues> name='lastName' label='Last name' control={control} />
          <TextInputField<UserFormValues> name='maidenName' label='Maiden name' control={control} />

          <NumberInputField<UserFormValues> name='age' label='Age' control={control} />

          <SelectField<UserFormValues> name='gender' label='Gender' control={control} data={["male", "female"]} />

          <TextInputField<UserFormValues> name='username' label='Username' control={control} />
          <TextInputField<UserFormValues> name='password' label='Password' control={control} />

          <DatePickerField<UserFormValues> name='birthDate' label='Birth date' control={control} />

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
