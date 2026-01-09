import type { DataTableProps } from "../types/types";
import { Loader, Table, Text } from "@mantine/core";

export function UsersTable<T extends { id: number | string }>({
  data,
  columns,
  emptyText = "Нет данных",
  isLoading = false,
}: DataTableProps<T>) {
  return (
    <Table style={{ tableLayout: "fixed", width: "100%" }}>
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
          data.map((row) => (
            <Table.Tr key={row.id}>
              {columns.map((col) => {
                if (col.type === "actions") {
                  return <Table.Td key='actions'>{col.render(null, row)}</Table.Td>;
                }

                const value = row[col.key];

                return <Table.Td key={String(col.key)}>{col.render ? col.render(value, row) : String(value)}</Table.Td>;
              })}
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
}
