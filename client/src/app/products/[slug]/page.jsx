import { Footer } from "@/components/common/navigation/Footer"
import { Navbar } from "@/components/common/navigation/Navbar"
import { ProductCushion } from "@/components/layout/product/ProductCushion"
import { ProductFeature } from "@/components/layout/product/ProductFeature"
import { ProductItem } from "@/components/layout/product/ProductItem"
import { ProductSimilar } from "@/components/layout/product/ProductSimilar"

export default function ProductItemPage() {
    return (
        <div className="w-full min-h-screen flex flex-col justify-between">
            <Navbar/>
            <main className="flex flex-col gap-5 overflow-hidden my-4">
                <ProductItem/>
                <ProductCushion/>
                <ProductFeature/>
                <ProductSimilar/>
            </main>
            <Footer/>
        </div>
    )
}