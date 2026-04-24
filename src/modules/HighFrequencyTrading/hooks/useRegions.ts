import { useQuery } from "@tanstack/react-query";
import {
    paginatedRegionSchema,
    type PaginatedRegions,
} from "../schema/region.schema";

interface UseRegionsArgs {
    page: number;
    perPage?: number;
    search?: string;
}

const fetchRegions = async ({
    page,
    perPage = 10,
    search,
}: UseRegionsArgs): Promise<PaginatedRegions> => {
    const url = new URL("http://localhost:4000/regions");
    url.searchParams.append("_page", page.toString());
    url.searchParams.append("_per_page", perPage.toString());

    if (search) {
        url.searchParams.append("name:contains", search);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`Failed to fetch regions: ${response.statusText}`);
    }

    const rawData = await response.json();
    return paginatedRegionSchema.parse(rawData);
};

export function useRegions(args: UseRegionsArgs) {
    return useQuery({
        queryKey: ["regions", args.page, args.perPage, args.search],
        queryFn: () => fetchRegions(args),
        staleTime: 60 * 1000,
        placeholderData: (previousData) => previousData,
    });
}
