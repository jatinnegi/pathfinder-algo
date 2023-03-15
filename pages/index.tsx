import React, { useEffect, useState } from "react";
import { NextPage } from "next";

import Dijkstra from "src/algos/dijkstra";
import breadthFirstSearch from "src/algos/breadth-first-search";
import depthFirstSearch from "src/algos/depth-first-search";

import AppBar from "@components/AppBar";
import Legend from "@components/Legend";
import Graph, {
  MAX_COLS,
  MAX_ROWS,
  NODE_HEIGHT,
  NODE_WIDTH,
  GraphProps,
  GraphTableProps,
  NodeProps,
} from "@components/Graph";

const Home: NextPage = () => {
  const [algo, setAlgo] = useState<"dijkstra" | "bfs" | "dfs">("dijkstra");
  const [speed, setSpeed] = useState<"fast" | "medium" | "slow">("fast");

  const [animationOver, setAnimationOver] = useState<boolean>(true);
  const [firstAnimation, setFirstAnimation] = useState<boolean>(true);
  const [wallNodes, setWallNodes] = useState<Record<string, number>>({});
  const [wallCurrent, setWallCurrent] = useState<string>("");

  const [graph, setGraph] = useState<GraphTableProps>({
    rows: 0,
    cols: 0,
    adjacencyList: {},
    initialized: false,
  });

  const [initialStart, setInitialStart] = useState<string>("");
  const [initialEnd, setInitialEnd] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  const initializeGraph = (viewportHeight: number, viewportWidth: number) => {
    const rows = Math.min(
      MAX_ROWS,
      Math.floor((viewportHeight - 275) / NODE_HEIGHT)
    );
    const cols = Math.min(MAX_COLS, Math.floor(viewportWidth / NODE_WIDTH));

    const adjacencyList: GraphProps = {};

    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++) {
        const key: string = `${i}-${j}`;

        adjacencyList[key] = [];

        const [left, right, up, down] = [j - 1, j + 1, i - 1, i + 1];

        if (left >= 0)
          adjacencyList[key].push({ node: `${i}-${left}`, weight: 1 });
        if (right < cols)
          adjacencyList[key].push({ node: `${i}-${right}`, weight: 1 });
        if (up >= 0) adjacencyList[key].push({ node: `${up}-${j}`, weight: 1 });
        if (down < rows)
          adjacencyList[key].push({ node: `${down}-${j}`, weight: 1 });
      }

    setGraph({
      rows,
      cols,
      adjacencyList,
      initialized: true,
    });
  };

  const animatePath = (path: string[]) => {
    for (let i = 0; i < path.length; i++)
      setTimeout(() => {
        const span = document.getElementById(`${path[i]}-span`);
        const td = document.getElementById(path[i]);

        if (!span || !td) return;

        td.classList.add("remove-border");
        span.classList.add("path");
      }, 10 * i);
  };

  const animateGraph = (order: string[]) => {
    const delaySecond = speed === "fast" ? 10 : speed === "medium" ? 30 : 60;

    for (let i = 0; i < order.length; i++)
      setTimeout(() => {
        const span = document.getElementById(`${order[i]}-span`);
        if (!span) return;
        span.classList.add("visited");
      }, delaySecond * i);
  };

  const reset = () => {
    const spans = document.querySelectorAll("td span");
    const tds = document.querySelectorAll("td");

    for (let i = 0; i < tds.length; i++)
      tds[i].classList.remove("remove-border");

    for (let i = 0; i < spans.length; i++) {
      spans[i].classList.remove("visited");
      spans[i].classList.remove("path");
    }
  };

  const defaultSearch = (queue: string[]): string[] => {
    const visited = new Set<string>();
    const order: string[] = [];

    while (queue.length) {
      const current = queue.shift();

      if (!current || visited.has(current) || wallNodes[current]) continue;

      order.push(current);

      graph.adjacencyList[current].forEach((neighbor: NodeProps) =>
        queue.push(neighbor.node)
      );

      visited.add(current);
    }

    return order;
  };

  const defaultSearchDepth = (stack: string[]): string[] => {
    const visited = new Set<string>();
    const order: string[] = [];

    while (stack.length) {
      const current = stack.pop();

      if (!current || visited.has(current) || wallNodes[current]) continue;

      order.push(current);

      graph.adjacencyList[current].forEach((neighbor: NodeProps) =>
        stack.push(neighbor.node)
      );

      visited.add(current);
    }

    return order;
  };

  const pathNotFound = (path: string[]) => {
    let order: string[] = [];

    if (algo === "dfs") order = defaultSearchDepth(path);
    else order = defaultSearch(path);

    animateGraph(order);
    setAnimationOver(true);
  };

  const visualize = (_: React.MouseEvent<HTMLButtonElement>) => {
    if (!animationOver) return;
    reset();
    setFirstAnimation(false);
    setAnimationOver(false);

    setTimeout(() => {
      const path: string[] = [];
      const order: string[] = [];
      let delaySeconds: number = 0;

      if (algo === "bfs") {
        delaySeconds = breadthFirstSearch(
          graph.adjacencyList,
          start,
          end,
          wallNodes,
          path,
          order,
          speed
        );

        if (path.length === 0) {
          pathNotFound([start]);
          return;
        }
      } else if (algo === "dfs") {
        delaySeconds = depthFirstSearch(
          graph.adjacencyList,
          start,
          end,
          wallNodes,
          path,
          order,
          speed
        );

        if (path.length === 0) {
          pathNotFound([start]);
          return;
        }
      } else if (algo === "dijkstra") {
        delaySeconds = Dijkstra(
          graph.adjacencyList,
          start,
          end,
          wallNodes,
          path,
          order,
          speed
        );

        if (path.length === 1) {
          pathNotFound(path);
          return;
        }
      }

      animateGraph(order);

      setTimeout(() => {
        animatePath(path.reverse());
        setAnimationOver(true);
      }, delaySeconds * 1000);
    }, 100);
  };

  const resetWall = () => {
    if (!animationOver) return;
    reset();
    setWallNodes({});
  };

  const resetBoard = () => {
    if (!animationOver) return;

    resetWall();
    setStart(initialStart);
    setEnd(initialEnd);
  };

  useEffect(() => {
    const row = Math.floor(Math.random() * graph.rows);
    const col1 = 6;
    const col2 = Math.min(graph.cols - 3, 15);

    setInitialStart(`${row}-${col1}`);
    setInitialEnd(`${row}-${col2}`);
  }, [graph.rows]);

  useEffect(() => {
    setStart(initialStart);
    setEnd(initialEnd);
  }, [initialStart, initialEnd]);

  return (
    <>
      <AppBar
        algo={algo}
        setAlgo={setAlgo}
        speed={speed}
        setSpeed={setSpeed}
        visualize={visualize}
        resetWall={resetWall}
        resetBoard={resetBoard}
      />
      <Legend />
      <Graph
        initializeGraph={initializeGraph}
        graph={graph}
        start={start}
        end={end}
        firstAnimation={firstAnimation}
        animationOver={animationOver}
        wallNodes={wallNodes}
        setWallNodes={setWallNodes}
        setStart={setStart}
        setEnd={setEnd}
        reset={reset}
        wallCurrent={wallCurrent}
        setWallCurrent={setWallCurrent}
      />
    </>
  );
};

export default Home;
