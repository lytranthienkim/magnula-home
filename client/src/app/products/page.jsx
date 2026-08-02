import { Navbar } from "@/components/common/navigation/Navbar";
import { ProductContainer } from "@/components/layout/product/ProductContainer";

export default function ProductsPage() {
    return (
        <div className="w-full min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className="my-4 overflow-hidden flex-1">
                <ProductContainer/>
            </main>
        </div>
    )
} 