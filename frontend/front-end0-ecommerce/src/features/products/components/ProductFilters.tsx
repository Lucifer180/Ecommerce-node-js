import { FilterLines, SearchLg } from "@untitledui/icons";

import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";

import { useCategories } from "../hooks/useCategories";
import type { ProductListParams } from "../types";

type ProductFiltersProps = {
    filters: ProductListParams;
    onChange: (next: Partial<ProductListParams>) => void;
    onReset: () => void;
};

const ALL_CATEGORIES = "__all__";

export const ProductFilters = ({ filters, onChange, onReset }: ProductFiltersProps) => {
    const { data: categories = [] } = useCategories();

    const categoryItems = [
        { id: ALL_CATEGORIES, label: "All categories" },
        ...categories.map((category) => ({ id: category, label: category })),
    ];

    const hasFilters = Boolean(filters.keyword || filters.category || filters.minPrice || filters.maxPrice);

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-4 md:flex-row md:items-end">
            <div className="flex-1">
                <Input
                    label="Search"
                    icon={SearchLg}
                    placeholder="Search products"
                    value={filters.keyword ?? ""}
                    onChange={(keyword) => onChange({ keyword: keyword || undefined })}
                />
            </div>

            <div className="w-full md:w-56">
                <Select
                    label="Category"
                    items={categoryItems}
                    selectedKey={filters.category ?? ALL_CATEGORIES}
                    onSelectionChange={(key) => onChange({ category: key === ALL_CATEGORIES ? undefined : String(key) })}
                >
                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
            </div>

            <div className="flex gap-3">
                <Input
                    label="Min price"
                    type="number"
                    placeholder="0"
                    value={filters.minPrice?.toString() ?? ""}
                    onChange={(value) => onChange({ minPrice: value ? Number(value) : undefined })}
                />
                <Input
                    label="Max price"
                    type="number"
                    placeholder="Any"
                    value={filters.maxPrice?.toString() ?? ""}
                    onChange={(value) => onChange({ maxPrice: value ? Number(value) : undefined })}
                />
            </div>

            {hasFilters && (
                <Button color="tertiary" size="md" iconLeading={FilterLines} onPress={onReset}>
                    Clear
                </Button>
            )}
        </div>
    );
};
