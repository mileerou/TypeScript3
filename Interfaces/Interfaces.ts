export interface Medicamento {
  nombre: string;
  principioActivo: string;
  precio: number;
  stock: number;
  categoria: "analgesico" | "antibiotico" | "antihipertensivo" | "vitamina" | "otro";
  requiereReceta: boolean;
}

export interface BSTNode<T> {
  value: T;
  left:  BSTNode<T> | null;
  right: BSTNode<T> | null;
}

export type Comparator<T> = (a: T, b: T) => number;

export type TraversalOrder = "inorder" | "preorder" | "postorder" | "levelOrder";

export type SearchResult<T> =
  | { found: true;  node: BSTNode<T>; pasos: number }
  | { found: false; node: null;       pasos: number };

export interface IBinarySearchTree<T> {
  insert(value: T): void;
  remove(key: string): boolean;
  search(key: string): SearchResult<T>;
  inorder(): T[];
  min(): T | null;
  max(): T | null;
  height: number;
  size: number;
}