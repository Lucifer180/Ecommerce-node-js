import { CallToAction } from "../components/CallToAction";
import { CategoryTiles } from "../components/CategoryTiles";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { Hero } from "../components/Hero";
import { ValueProps } from "../components/ValueProps";

export default function LandingPage() {
    return (
        <>
            <Hero />
            <ValueProps />
            <FeaturedProducts />
            <CategoryTiles />
            <CallToAction />
        </>
    );
}
