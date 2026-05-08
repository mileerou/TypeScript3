export interface INode<T> {
    value: T;
    left: INode<T> | null;
    right: INode<T> | null;
}

export interface IBinarySearchTree<T> {
    insert(value: T): void;
    search(value: T): boolean;
    inOrder(): T[];
}