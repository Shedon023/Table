import type { UserDTO } from "../types/types";

export async function getUserById(id: number): Promise<UserDTO> {
  const res = await fetch(`https://dummyjson.com/users/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}
