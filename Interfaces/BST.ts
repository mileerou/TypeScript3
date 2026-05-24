import { BSTNode, Comparator, IBinarySearchTree, SearchResult } from "./Interfaces";

export class BST<T> implements IBinarySearchTree<T> {
  private root: BSTNode<T> | null = null;
  private _size = 0;
  private cmp: Comparator<T>;
  private keyOf: (value: T) => string;

  constructor(comparator: Comparator<T>, keyExtractor: (value: T) => string) {
    this.cmp   = comparator;
    this.keyOf = keyExtractor;
  }

  insert(value: T): void {
    const [newRoot, inserted] = this._insert(this.root, value);
    this.root = newRoot;
    if (inserted) this._size++;
  }

  private _insert(node: BSTNode<T> | null, value: T): [BSTNode<T>, boolean] {
    if (node === null) return [{ value, left: null, right: null }, true];
    const c = this.cmp(value, node.value);
    if (c < 0) {
      const [l, ins] = this._insert(node.left, value);
      node.left = l;
      return [node, ins];
    } else if (c > 0) {
      const [r, ins] = this._insert(node.right, value);
      node.right = r;
      return [node, ins];
    } else {
      node.value = value;
      return [node, false];
    }
  }

  remove(key: string): boolean {
    const [newRoot, deleted] = this._remove(this.root, key);
    this.root = newRoot;
    if (deleted) this._size--;
    return deleted;
  }

  private _remove(node: BSTNode<T> | null, key: string): [BSTNode<T> | null, boolean] {
    if (node === null) return [null, false];
    const nodeKey = this.keyOf(node.value);
    if (key < nodeKey) {
      const [l, del] = this._remove(node.left, key);
      node.left = l;
      return [node, del];
    } else if (key > nodeKey) {
      const [r, del] = this._remove(node.right, key);
      node.right = r;
      return [node, del];
    } else {
      if (node.left === null)  return [node.right, true];
      if (node.right === null) return [node.left,  true];
      let sucesor = node.right;
      while (sucesor.left !== null) sucesor = sucesor.left;
      node.value = sucesor.value;
      const [r] = this._remove(node.right, this.keyOf(sucesor.value));
      node.right = r;
      return [node, true];
    }
  }

  search(key: string): SearchResult<T> {
    let current = this.root;
    let pasos   = 0;
    while (current !== null) {
      pasos++;
      const k = this.keyOf(current.value);
      if (key === k) return { found: true, node: current, pasos };
      current = key < k ? current.left : current.right;
    }
    return { found: false, node: null, pasos };
  }

  inorder(): T[] {
    const result: T[] = [];
    const go = (n: BSTNode<T> | null) => {
      if (n === null) return;
      go(n.left); result.push(n.value); go(n.right);
    };
    go(this.root);
    return result;
  }

  preorder(): T[] {
    const result: T[] = [];
    const go = (n: BSTNode<T> | null) => {
      if (n === null) return;
      result.push(n.value); go(n.left); go(n.right);
    };
    go(this.root);
    return result;
  }

  levelOrder(): T[] {
    if (this.root === null) return [];
    const result: T[] = [];
    const queue: BSTNode<T>[] = [this.root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.value);
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }

  rangeSearch(desde: string, hasta: string): T[] {
    const result: T[] = [];
    const go = (n: BSTNode<T> | null) => {
      if (n === null) return;
      const k = this.keyOf(n.value);
      if (k > desde) go(n.left);
      if (k >= desde && k <= hasta) result.push(n.value);
      if (k < hasta)  go(n.right);
    };
    go(this.root);
    return result;
  }

  min(): T | null {
    if (this.root === null) return null;
    let n = this.root;
    while (n.left !== null) n = n.left;
    return n.value;
  }

  max(): T | null {
    if (this.root === null) return null;
    let n = this.root;
    while (n.right !== null) n = n.right;
    return n.value;
  }

  get height(): number {
    const h = (n: BSTNode<T> | null): number =>
      n === null ? -1 : 1 + Math.max(h(n.left), h(n.right));
    return h(this.root);
  }

  get size(): number { return this._size; }
}