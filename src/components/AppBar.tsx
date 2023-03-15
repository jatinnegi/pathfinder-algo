import React from "react";

import Dropdown from "./Dropdown";
import Container from "./Container";

interface Props {
  algo: "dijkstra" | "bfs" | "dfs";
  setAlgo: React.Dispatch<React.SetStateAction<"dijkstra" | "bfs" | "dfs">>;
  speed: "fast" | "medium" | "slow";
  setSpeed: React.Dispatch<React.SetStateAction<"fast" | "medium" | "slow">>;
  visualize: (e: React.MouseEvent<HTMLButtonElement>) => void;
  resetWall: () => void;
  resetBoard: () => void;
}

const AppBar: React.FC<Props> = ({
  algo,
  setAlgo,
  speed,
  setSpeed,
  visualize,
  resetWall,
  resetBoard,
}) => {
  const getAlgoName = (algo: string) => {
    if (algo === "dijkstra") return "Dijkstra";
    if (algo === "bfs") return "BFS";
    if (algo === "dfs") return "DFS";
  };

  return (
    <div className="w-full bg-gray-700 pt-2">
      <Container>
        <p className="text-lg font-medium text-white uppercase tracking-widest">
          Pathfinder-Algo
        </p>
        <div className="mt-2 grid grid-cols-3 lg:grid-cols-5 gap-x-4">
          <div>
            <Dropdown
              selectedValue={algo}
              setSelectedValue={(key: string) => {
                if (key === "dijkstra" || key === "bfs" || key === "dfs")
                  setAlgo(key);
              }}
              options={{
                dijkstra: "Dijkstra",
                bfs: "Breadth-First-Search",
                dfs: "Depth-First-Search",
              }}
            />
          </div>
          <div className="hidden lg:block">
            <Dropdown
              selectedValue={speed}
              setSelectedValue={(key: string) => {
                if (key === "fast" || key === "medium" || key === "slow")
                  setSpeed(key);
              }}
              options={{
                fast: "Fast",
                medium: "Medium",
                slow: "Slow",
              }}
            />
          </div>
          <button
            type="button"
            className="bg-none hover:bg-green-500 outline-none py-4 text-white font-medium text-xs lg:text-base"
            onClick={() => {
              resetBoard();
            }}
          >
            Reset Board
          </button>

          <button
            type="button"
            className="hidden lg:block bg-none hover:bg-green-500 outline-none py-4 text-white font-medium"
            onClick={() => {
              resetWall();
            }}
          >
            Clear Walls
          </button>

          <button
            type="button"
            className="bg-none hover:bg-green-500 outline-none py-1 lg:py-4 text-white font-medium
            text-xs lg:text-base"
            onClick={visualize}
          >
            Visualize {getAlgoName(algo)}
          </button>
        </div>
      </Container>
    </div>
  );
};

export default AppBar;
