import { Footer } from "@/components/common/navigation/Footer";
import { Navbar } from "@/components/common/navigation/Navbar";
import { ProductContainer } from "@/components/layout/product/ProductContainer";

export default function ProductsPage() {
    return (
        <div className="w-full min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className="my-4 overflow-hidden">
                <ProductContainer/>
            </main>
            <Footer />
        </div>
    )
}