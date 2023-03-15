import {
  GraphProps,
  FAST_SPEED,
  MEDIUM_SPEED,
  SLOW_SPEED,
} from "@components/Graph";

export class Node {
  val;
  priority;

  constructor(val: string, priority: number) {
    this.val = val;
    this.priority = priority;
  }
}

export class PriorityQueue {
  values: Node[] = [];

  constructor() {
    this.values = [];
  }

  enqueue(val: string, priority: number) {
    let newNode = new Node(val, priority);
    this.values.push(newNode);
    this.bubbleUp();
  }
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }
  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0 && typeof end !== "undefined") {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null &&
            typeof leftChild !== "undefined" &&
            rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
}

export default function Dijkstra(
  adjacencyList: GraphProps,
  start: string,
  finish: string,
  wallNodes: Record<string, number>,
  path: string[],
  order: string[],
  speed: "fast" | "slow" | "medium"
) {
  const nodes = new PriorityQueue();
  const distances: any = {};
  const previous: any = {};
  let smallest;

  //build up initial state
  for (let vertex in adjacencyList) {
    if (wallNodes[vertex]) continue;
    if (vertex === start) {
      distances[vertex] = 0;
      nodes.enqueue(vertex, 0);
    } else {
      distances[vertex] = Infinity;
      nodes.enqueue(vertex, Infinity);
    }
    previous[vertex] = null;
  }
  // as long as there is something to visit
  while (nodes.values.length) {
    smallest = nodes.dequeue().val;
    order.push(smallest);

    if (smallest === finish) {
      //WE ARE DONE
      //BUILD UP PATH TO RETURN AT END
      while (smallest && previous[smallest]) {
        path.push(smallest);
        smallest = previous[smallest];
      }
      break;
    }
    if (smallest || distances[smallest] !== Infinity) {
      for (let neighbor in adjacencyList[smallest]) {
        //find neighboring node
        let nextNode = adjacencyList[smallest][neighbor];
        //calculate new distance to neighboring node
        let candidate = distances[smallest] + nextNode.weight;
        let nextNeighbor = nextNode.node;
        if (candidate < distances[nextNeighbor]) {
          //updating new smallest distance to neighbor
          distances[nextNeighbor] = candidate;
          //updating previous - How we got to neighbor
          previous[nextNeighbor] = smallest;
          //enqueue in priority queue with new priority
          nodes.enqueue(nextNeighbor, candidate);
        }
      }
    }
  }

  const traverseSpeed =
    speed === "fast"
      ? FAST_SPEED
      : speed === "medium"
      ? MEDIUM_SPEED
      : SLOW_SPEED;

  path.push(start);
  path.concat(smallest);
  return order.length * traverseSpeed + 0.5;
}
