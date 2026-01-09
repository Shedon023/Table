import { Modal, Button, Group, Loader, Text } from "@mantine/core";
import type { UserFormInput } from "../schema/schema";
import { TextInputField } from "../form-fields/TextInputField";
import { NumberInputField } from "../form-fields/NumberInputField";
import { DatePickerField } from "../form-fields/DatePickerFIeld";
import { SelectField } from "../form-fields/SelectField";
import type { Control, SubmitHandler, UseFormHandleSubmit } from "react-hook-form";

type EditUserModalProps = {
  opened: boolean;
  onClose: () => void;
  isFormLoading: boolean;
  control: Control<UserFormInput>;
  handleSubmit: UseFormHandleSubmit<UserFormInput>;
  isSubmitting: boolean;
  onSubmit: SubmitHandler<UserFormInput>;
};

export const EditUserModal = ({
  opened,
  onClose,
  isFormLoading,
  control,
  handleSubmit,
  isSubmitting,
  onSubmit,
}: EditUserModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size='xl'>
          Edit User
        </Text>
      }>
      {isFormLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}>
          <Loader size='lg' />
        </div>
      ) : (
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
      )}
    </Modal>
  );
};
