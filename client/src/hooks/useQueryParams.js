import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const useQueryParams = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const updateQueryParams = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return { updateQueryParams, searchParams, router, pathname };
};
