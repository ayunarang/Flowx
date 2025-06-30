import { Position } from "reactflow";
import { CustomNode } from "../components/CustomNode";

export const AuthNode = ({ id, data }) => {
  const content = <span>This is an Auth flow.</span>;

  return (
    <CustomNode
      title="Auth"
      content={content}
            data={data}

      handles={[
        {
          type: "target",
          position: Position.Left,
          id: `${id}-authRequest`,
        },
        { type: "source", position: Position.Right, id: `${id}-authResponse` },
      ]}
    />
  );
};
