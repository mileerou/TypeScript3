import { INode } from "./Interfaces";

export class Node<T> implements INode<T> {

    value: T;
    left: Node<T> | null;
    right: Node<T> | null;

    constructor(value: T) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}