import styled from "@emotion/styled";
import { useCallback, useContext } from "react";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  PanOnScrollMode,
  NodeDragHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import FlowContext from "./FlowContext";
import ChatGPTChatCompletionNode from "./nodes/ChatGPTChatCompletionNode";
import ChatGPTMessageNode from "./nodes/ChatGPTMessageNode";
import ElevenLabsNode from "./nodes/ElevenLabsNode";
import HuggingFaceInferenceNode from "./nodes/HuggingFaceInferenceNode";
import InputNode from "./nodes/InputNode";
import JavaScriptFunctionNode from "./nodes/JavaScriptFunctionNode";
import OutputNode from "./nodes/OutputNode";
import TextTemplateNode from "./nodes/TextTemplateNode";
import SidePanel from "./side-panel/SidePanel";
import { useFlowStore } from "./store/store-flow";
import { LocalNode, NodeType } from "./store/types-flow-content";
import { FlowState } from "./store/types-local-state";

const NODE_TYPES = {
  [NodeType.InputNode]: InputNode,
  [NodeType.OutputNode]: OutputNode,
  [NodeType.JavaScriptFunctionNode]: JavaScriptFunctionNode,
  [NodeType.ChatGPTMessageNode]: ChatGPTMessageNode,
  [NodeType.ChatGPTChatCompletionNode]: ChatGPTChatCompletionNode,
  [NodeType.TextTemplate]: TextTemplateNode,
  [NodeType.HuggingFaceInference]: HuggingFaceInferenceNode,
  [NodeType.ElevenLabs]: ElevenLabsNode,
};

const selector = (state: FlowState) => ({
  nodes: state.nodes,
  edges: state.edges,
  updateNode: state.updateNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export default function FlowCanvas() {
  const { isCurrentUserOwner } = useContext(FlowContext);

  const { nodes, edges, updateNode, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore(selector);

  const onNodeDragStop: NodeDragHandler = useCallback(
    (event, node) => {
      updateNode((node as LocalNode).id, { position: node.position });
    },
    [updateNode]
  );

  return (
    <Container>
      <ReactFlow
        panOnScroll
        panOnScrollMode={PanOnScrollMode.Free}
        minZoom={0.2}
        maxZoom={1.2}
        nodesConnectable={isCurrentUserOwner}
        elementsSelectable={isCurrentUserOwner}
        nodeTypes={NODE_TYPES}
        nodes={nodes}
        edges={edges}
        onInit={(reactflow) => {
          reactflow.fitView();
        }}
        onNodesChange={onNodesChange}
        onEdgesChange={isCurrentUserOwner ? onEdgesChange : undefined}
        onConnect={isCurrentUserOwner ? onConnect : undefined}
        onNodeDragStop={onNodeDragStop}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
      <SidePanel />
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  flex-grow: 1;
  min-height: 0;
  display: flex;
  position: relative;
`;
