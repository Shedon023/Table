import { useEffect, useState } from "react";
import type { UserDTO, UsersResponse } from "../types/types";

export const useGetUsers = (initialPage = 1, limit = 10) => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsError(false);
        setIsLoading(true);

        const skip = (page - 1) * limit;
        const res = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Failed fetch users");
        }
        const data: UsersResponse = await res.json();

        setUsers(data.users);

        setTotal(data.total);
      } catch (e) {
        setIsError(true);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [page, limit]);

  return { data: users, isLoading, isError, total, page, setPage, limit, setUsers };
};
