import type { DataTableProps } from "../types/types";
import { Loader, Table, Text } from "@mantine/core";

export function UsersTable<T extends { id: number | string }>({
  data,
  columns,
  emptyText = "Нет данных",
  isLoading = false,
}: DataTableProps<T>) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          {columns.map((col) => (
            <Table.Th key={String(col.key)}>{col.title}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {isLoading ? (
          <Table.Tr>
            <Table.Td colSpan={columns.length}>
              <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
                <Loader />
              </div>
            </Table.Td>
          </Table.Tr>
        ) : data.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={columns.length}>
              <Text ta='center'>{emptyText}</Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          data.map((row) => <Table.Tr key={row.id}></Table.Tr>)
        )}
      </Table.Tbody>
    </Table>
  );
}
