import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getGuests } from "../../services/apiGuests";
import { PAGE_SIZE } from "../../utils/constants";
import { useEffect, useMemo } from "react";

export function useGuests() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "fullName-asc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = useMemo(() => {
    return { field, direction };
  }, [direction, field]);

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const {
    isLoading,
    data: { data: currentPageGuests, count } = {},
    error,
  } = useQuery({
    queryKey: ["guests", sortBy, page],
    queryFn: () => getGuests({ sortBy, page }),
  });

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  // if (page < pageCount)
  //   queryClient.prefetchQuery({
  //     queryKey: ["guests", sortBy, page + 1],
  //     queryFn: () => getGuests({ sortBy, page: page + 1 }),
  //   });

  // if (page > 1)
  //   queryClient.prefetchQuery({
  //     queryKey: ["guests", sortBy, page - 1],
  //     queryFn: () => getGuests({ sortBy, page: page - 1 }),
  //   });

  // return { isLoading, error, guests, count };

  // Fetch all guests when the component mounts
  useEffect(() => {
    // Fetch all pages of guests
    const fetchAllGuests = async () => {
      const allGuests = [];
      for (let i = 1; i <= pageCount; i++) {
        const result = await queryClient.fetchQuery(["guests", sortBy, i], () =>
          getGuests({ sortBy, page: i })
        );
        allGuests.push(...result.data);
      }
      return allGuests;
    };
    fetchAllGuests().then((allGuests) => {
      queryClient.setQueryData(["allGuests"], allGuests);
    });
  }, [pageCount, queryClient, sortBy]);

  return { isLoading, error, guests: currentPageGuests, count };
}
