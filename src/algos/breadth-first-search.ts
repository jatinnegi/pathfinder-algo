import {
  GraphProps,
  FAST_SPEED,
  MEDIUM_SPEED,
  SLOW_SPEED,
} from "@components/Graph";

export default function breadthFirstSearch(
  graph: GraphProps,
  start: string,
  end: string,
  wallNodes: Record<string, number>,
  path: string[],
  order: string[],
  speed: string
) {
  const queue = [start];
  let counter = 0;

  const visited = new Set();
  const paths: { [key: string]: number } = {};
  const traverseSpeed =
    speed === "fast"
      ? FAST_SPEED
      : speed === "medium"
      ? MEDIUM_SPEED
      : SLOW_SPEED;

  while (queue.length) {
    const current = queue.shift();
    if (!current) continue;

    const currentNode = current === start ? start : current.split("#").pop();
    if (!currentNode) continue;

    if (visited.has(currentNode)) continue;
    if (wallNodes[currentNode]) continue;
    visited.add(currentNode);
    order.push(currentNode);
    counter++;

    if (currentNode === end) {
      current.split("#").forEach((val: string) => {
        path.push(val);
      });
      path.reverse();

      return counter * traverseSpeed + 0.5;
    }

    graph[currentNode].forEach((vertex) => {
      queue.push(`${current}#${vertex.node}`);
      paths[`${current}#${vertex.node}`] = 1;
    });
  }

  return counter * traverseSpeed + 0.5;
}
