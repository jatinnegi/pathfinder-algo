import React from "react";

import StartIcon from "src/icons/Start";
import EndIcon from "src/icons/End";

import Container from "./Container";

const Legend: React.FC = () => {
  return (
    <Container className="my-8">
      <div className="w-full grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <div className="flex items-center">
          <div className="w-3 h-3 mr-1 md:w-4 md:h-4 md:mr-2">
            <StartIcon />
          </div>
          <p className="font-medium capitalize text-xs text-gray-700 md:uppercase md:text-md lg:text-lg">
            Start Node
          </p>
        </div>

        <div className="flex items-center">
          <div className="w-3 h-3 mr-1">
            <EndIcon />
          </div>
          <p className="font-medium capitalize text-xs text-gray-700 md:uppercase md:text-md lg:text-lg">
            End Node
          </p>
        </div>

        <div className="flex items-center">
          <div
            className="w-3 h-3 mr-2 bg-white border md:h-4 md:w-4"
            style={{
              border: "1px solid rgb(175, 216, 248)",
            }}
          />
          <p
            className="font-medium capitalize text-xs text-gray-700 md:uppercase md:text-md
          lg:text-lg"
          >
            Unvisited Node
          </p>
        </div>

        <div className="flex items-center">
          <div
            className="w-3 h-3 mr-2 bg-white md:h-4 md:w-4"
            style={{
              background: "rgba(0, 190, 218, 0.75)",
            }}
          />
          <p className="font-medium capitalize text-xs text-gray-700 md:uppercase md:text-md lg:text-lg">
            Visited Node
          </p>
        </div>

        <div className="flex items-center">
          <div
            className="w-3 h-3 mr-2 bg-white md:h-4 md:w-4"
            style={{
              background: "rgb(255, 254, 106)",
            }}
          />
          <p className="font-medium capitalize text-xs text-gray-700 md:uppercase md:text-md lg:text-lg">
            Shortest Path
          </p>
        </div>

        <div className="flex items-center">
          <div
            className="w-3 h-3 mr-2 bg-white md:h-4 md:w-4"
            style={{
              background: "rgb(12, 53, 71)",
            }}
          />
          <p className="font-medium capitalize text-xs text-gray-700 md:uppercase md:text-md lg:text-lg">
            Wall Node
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Legend;
