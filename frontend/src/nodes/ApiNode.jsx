
import { Position } from "reactflow";
import { CustomNode } from "../components/CustomNode";

export const APINode = ({ id, data }) => {
  const content = <span>This is an API call.</span>;

  return (
    <CustomNode
      title="API"
      content={content}
            data={data}

      handles={[
        {
          type: "target",
          position: Position.Left,
          id: `${id}-apiRequest`,
        },
        { type: "source", position: Position.Right, id: `${id}-apiResponse` },
      ]}
    />
  );
};
