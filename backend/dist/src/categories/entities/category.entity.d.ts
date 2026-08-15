export declare class CategoryEntity {
    id: string;
    name: string;
    parent?: CategoryEntity;
    children: CategoryEntity[];
}
