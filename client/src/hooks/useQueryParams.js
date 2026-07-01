import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const useQueryParams = () => {
    const searchParams = useSearchParams(); // lay cac query param hien tai
    const router = useRouter(); // dieu huong trang
    const pathname = usePathname(); // lay duong dan goc /

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
