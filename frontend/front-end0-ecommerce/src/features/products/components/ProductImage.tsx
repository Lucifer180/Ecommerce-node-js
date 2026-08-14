import { Image01 } from "@untitledui/icons";

import { cx } from "@/utils/cx";
import type { Product } from "../types";

/**
 * Products store images as `Upload` documents holding an S3 key, not a public
 * URL — the only way to read one is the protected `GET /uploads/:id/url`
 * endpoint, which a public storefront cannot call.
 *
 * So: if you expose the bucket (or put a CDN in front of it) and set
 * VITE_ASSET_BASE_URL, images resolve. Otherwise we render a stable
 * placeholder derived from the product name instead of a broken image.
 */
const assetBaseUrl = import.meta.env.VITE_ASSET_BASE_URL as string | undefined;

export const getProductImageUrl = (product: Product): string | null => {
    const key = product.images?.[0]?.s3Key;
    if (!key || !assetBaseUrl) return null;
    return `${assetBaseUrl.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
};

const placeholderTints = [
    "from-brand-500/20 to-brand-700/10",
    "from-blue-500/20 to-blue-700/10",
    "from-pink-500/20 to-pink-700/10",
    "from-orange-500/20 to-orange-700/10",
    "from-green-500/20 to-green-700/10",
];

/** Same product always gets the same tint, so the grid looks intentional. */
const tintFor = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return placeholderTints[hash % placeholderTints.length];
};

type ProductImageProps = {
    product: Product;
    className?: string;
};

export const ProductImage = ({ product, className }: ProductImageProps) => {
    const url = getProductImageUrl(product);

    if (url) {
        return <img src={url} alt={product.name} loading="lazy" className={cx("size-full object-cover", className)} />;
    }

    return (
        <div className={cx("flex size-full items-center justify-center bg-linear-to-br", tintFor(product._id || product.name), className)}>
            <Image01 className="size-8 text-fg-quaternary" aria-hidden="true" />
            <span className="sr-only">{product.name}</span>
        </div>
    );
};
