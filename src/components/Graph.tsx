import React, { useEffect, useState } from "react";

import StartIcon from "src/icons/Start";
import EndIcon from "src/icons/End";

export interface NodeProps {
  node: string;
  weight: number;
}

export interface GraphProps {
  [key: string]: NodeProps[];
}

export interface GraphTableProps {
  rows: number;
  cols: number;
  adjacencyList: GraphProps;
  initialized: boolean;
}

export const NODE_HEIGHT = 25;
export const NODE_WIDTH = 25;

export const MAX_ROWS = 15;
export const MAX_COLS = 52;

export const FAST_SPEED = 0.01;
export const MEDIUM_SPEED = 0.03;
export const SLOW_SPEED = 0.06;

interface Props {
  initializeGraph: (viewportHeight: number, viewportWidth: number) => void;
  graph: GraphTableProps;
  start: string;
  end: string;
  firstAnimation: boolean;
  animationOver: boolean;
  wallNodes: Record<string, number>;
  setWallNodes: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setStart: React.Dispatch<React.SetStateAction<string>>;
  setEnd: React.Dispatch<React.SetStateAction<string>>;
  reset: () => void;
  wallCurrent: string;
  setWallCurrent: React.Dispatch<React.SetStateAction<string>>;
}

const Graph: React.FC<Props> = ({
  initializeGraph,
  graph,
  start,
  end,
  firstAnimation,
  wallNodes,
  setWallNodes,
  animationOver,
  setStart,
  setEnd,
  reset,
  wallCurrent,
  setWallCurrent,
}) => {
  const [dragCurrent, setDragCurrent] = useState<string>("");
  const [wall, setWall] = useState<boolean>(false);
  const [draggingStart, setDraggingStart] = useState<boolean>(false);
  const [draggingEnd, setDraggingEnd] = useState<boolean>(false);

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!animationOver) return;
    const element = e.target as HTMLElement;
    let id = element.id;

    if (!id || id.trim() === "") return;
    if (id === "__next") {
      setDraggingStart(false);
      setDraggingEnd(false);
      return;
    }
    if (id.includes("span")) id = id.replaceAll("-span", "");

    if (draggingStart && dragCurrent !== id && id !== end) {
      if (wallNodes[id]) return;
      setStart(id);
      if (!firstAnimation) reset();
    } else if (draggingEnd && dragCurrent !== id && id !== start) {
      if (wallNodes[id]) return;
      setEnd(id);
      if (!firstAnimation) reset();
    } else if (wall && id !== start && id !== end && wallCurrent !== id) {
      if (!firstAnimation) reset();
      setWallCurrent(id);
      if (wallNodes[id]) setWallNodes({ ...wallNodes, [id]: 0 });
      else setWallNodes({ ...wallNodes, [id]: 1 });
    }
  };

  useEffect(() => {
    if (window) initializeGraph(window.innerHeight, window.innerWidth);

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("touchmove", handleMove);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove);
    };
  }, [
    animationOver,
    dragCurrent,
    draggingStart,
    draggingEnd,
    wall,
    wallNodes,
    wallCurrent,
  ]);

  const draw = (): JSX.Element[] => {
    const rows: JSX.Element[] = [];

    for (let i = 0; i < graph.rows; i++) {
      const dataCells: JSX.Element[] = [];

      for (let j = 0; j < graph.cols; j++) {
        const key = `${i}-${j}`;

        dataCells.push(
          <td
            key={key}
            id={key}
            className={`${
              wallNodes[key] ? "wall-node" : ""
            } relative cursor-pointer`}
            style={{
              height: `${NODE_HEIGHT}px`,
              width: `${NODE_WIDTH}px`,
            }}
            onMouseDown={(_: React.MouseEvent) => {
              setDragCurrent(key);
              if (key === start) {
                setDraggingEnd(false);
                setDraggingStart(true);
              } else if (key === end) {
                setDraggingStart(false);
                setDraggingEnd(true);
              } else setWall(true);
            }}
            onMouseUp={(_: React.MouseEvent) => {
              setDraggingStart(false);
              setDraggingEnd(false);
              setWall(false);
            }}
            onClick={(_: React.MouseEvent) => {
              if (!animationOver) return;
              if (key === start || key === end) return;
              if (!firstAnimation) reset();
              if (wallNodes[key]) setWallNodes({ ...wallNodes, [key]: 0 });
              else setWallNodes({ ...wallNodes, [key]: 1 });
            }}
          >
            {start === key && (
              <div className="h-4 w-4" style={{ pointerEvents: "none" }}>
                <StartIcon />
              </div>
            )}
            {end === key && (
              <div className="h-4 w-4" style={{ pointerEvents: "none" }}>
                <EndIcon />
              </div>
            )}
            <span id={`${key}-span`} style={{ pointerEvents: "none" }} />
          </td>
        );
      }

      const row: JSX.Element = (
        <tr key={`${i}`} id={`${i}`}>
          {dataCells.map((cell: JSX.Element) => cell)}
        </tr>
      );

      rows.push(row);
    }

    return rows;
  };

  if (!graph.initialized) return <p>Loading...</p>;

  return (
    <table className="mx-auto">
      <tbody>{draw()}</tbody>
    </table>
  );
};

export default Graph;
