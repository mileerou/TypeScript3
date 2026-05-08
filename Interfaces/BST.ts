import { IBinarySearchTree } from "./Interfaces";
import { Node } from "./Nodo";

export class BinarySearchTree<T>
implements IBinarySearchTree<T> {

    root: Node<T> | null;

    constructor() {
        this.root = null;
    }

    insert(value: T): void {

        const newNode = new Node(value);

        if (this.root === null) {
            this.root = newNode;
            return;
        }

        let current = this.root;

        while (true) {

            if (value < current.value) {

                if (current.left === null) {
                    current.left = newNode;
                    return;
                }

                current = current.left;

            } else {

                if (current.right === null) {
                    current.right = newNode;
                    return;
                }

                current = current.right;
            }
        }
    }

    search(value: T): boolean {

        let current = this.root;

        while (current !== null) {

            if (value === current.value) {
                return true;
            }

            current = value < current.value
                ? current.left
                : current.right;
        }

        return false;
    }

    inOrder(): T[] {

        const result: T[] = [];

        function traverse(node: Node<T> | null): void {

            if (node !== null) {

                traverse(node.left);

                result.push(node.value);

                traverse(node.right);
            }
        }

        traverse(this.root);

        return result;
    }
}