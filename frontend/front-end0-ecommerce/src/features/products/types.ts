/** A populated `Upload` document. Note it carries an S3 key, not a public URL. */
export interface ProductImage {
    _id: string;
    originalName: string;
    s3Key: string;
    mimeType: string;
}

export interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category?: string;
    images?: ProductImage[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductListParams {
    keyword?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}

/** Normalized page of products, regardless of which backend shape arrived. */
export interface ProductPage {
    items: Product[];
    currentPage: number;
    totalPages: number;
    totalProducts: number;
}
