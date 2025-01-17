import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { useContext, useMemo, useState } from "react";
import { Position, useNodeId } from "reactflow";
import {
  LocalStorageState,
  SpaceState,
  useLocalStorageStore,
  useSpaceStore,
} from "../../state/appState";
import FlowContext from "../FlowContext";
import InputReadonly from "../flow-common/InputReadonly";
import { useFlowStore } from "../store/store-flow";
import {
  HuggingFaceInferenceNodeConfig,
  NodeID,
  NodeType,
} from "../store/types-flow-content";
import { FlowState } from "../store/types-local-state";
import HeaderSection from "./node-common/HeaderSection";
import HelperTextContainer from "./node-common/HelperTextContainer";
import NodeBox, { NodeState } from "./node-common/NodeBox";
import NodeInputModifyRow from "./node-common/NodeInputModifyRow";
import NodeOutputRow from "./node-common/NodeOutputRow";
import { InputHandle, OutputHandle, Section } from "./node-common/node-common";
import {
  calculateInputHandleTop,
  calculateOutputHandleBottom,
} from "./node-common/utils";

const flowSelector = (state: FlowState) => ({
  nodeConfigs: state.nodeConfigs,
  updateNodeConfig: state.updateNodeConfig,
  removeNode: state.removeNode,
  localNodeAugments: state.localNodeAugments,
  defaultVariableValueMap: state.getDefaultVariableValueMap(),
});

const persistSelector = (state: LocalStorageState) => ({
  huggingFaceApiToken: state.huggingFaceApiToken,
  setHuggingFaceApiToken: state.setHuggingFaceApiToken,
});

const selector = (state: SpaceState) => ({
  missingHuggingFaceApiToken: state.missingHuggingFaceApiToken,
  setMissingHuggingFaceApiToken: state.setMissingHuggingFaceApiToken,
});

export default function HuggingFaceInferenceNode() {
  const { isCurrentUserOwner } = useContext(FlowContext);

  const nodeId = useNodeId() as NodeID;

  const {
    nodeConfigs,
    updateNodeConfig,
    removeNode,
    localNodeAugments,
    defaultVariableValueMap,
  } = useFlowStore(flowSelector);
  const { huggingFaceApiToken, setHuggingFaceApiToken } =
    useLocalStorageStore(persistSelector);
  const { missingHuggingFaceApiToken, setMissingHuggingFaceApiToken } =
    useSpaceStore(selector);

  const nodeConfig = useMemo(
    () => nodeConfigs[nodeId] as HuggingFaceInferenceNodeConfig | undefined,
    [nodeConfigs, nodeId]
  );

  const augment = useMemo(
    () => localNodeAugments[nodeId],
    [localNodeAugments, nodeId]
  );

  // It's OK to force unwrap here because nodeConfig will be undefined only
  // when Node is being deleted.
  const [model, setModel] = useState(() => nodeConfig!.model);

  if (!nodeConfig) {
    return null;
  }

  return (
    <>
      <InputHandle
        type="target"
        id={nodeConfig.inputs[0].id}
        position={Position.Left}
        style={{ top: calculateInputHandleTop(-1) }}
      />
      <NodeBox
        nodeType={NodeType.HuggingFaceInference}
        state={
          augment?.isRunning
            ? NodeState.Running
            : augment?.hasError
            ? NodeState.Error
            : NodeState.Idle
        }
      >
        <HeaderSection
          isCurrentUserOwner={isCurrentUserOwner}
          title="Hugging Face Inference"
          onClickRemove={() => removeNode(nodeId)}
        />
        <Section>
          <NodeInputModifyRow
            key={nodeConfig.inputs[0].id}
            name={nodeConfig.inputs[0].name}
            isReadOnly
          />
        </Section>
        <Section>
          <HelperTextContainer>
            Check Hugging Face's free{" "}
            <a
              href="https://huggingface.co/docs/api-inference/quicktour"
              target="_blank"
              rel="noreferrer"
            >
              Inference API documentation
            </a>{" "}
            for more information about the <code>parameters</code> input.
            Depending on the model you choose, you need to specify different
            parameters.
          </HelperTextContainer>
        </Section>
        {isCurrentUserOwner && (
          <Section>
            <FormControl>
              <FormLabel>API Token</FormLabel>
              <Input
                type="password"
                color={missingHuggingFaceApiToken ? "danger" : "neutral"}
                value={huggingFaceApiToken ?? ""}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  setHuggingFaceApiToken(value.length ? value : null);
                  setMissingHuggingFaceApiToken(false);
                }}
              />
              {missingHuggingFaceApiToken && (
                <HelperTextContainer color="danger">
                  Must provide a Hugging Face API token.
                </HelperTextContainer>
              )}
              <FormHelperText>
                This is stored in your browser's local storage. Never uploaded.
              </FormHelperText>
            </FormControl>
          </Section>
        )}
        <Section>
          <FormControl>
            <FormLabel>Model</FormLabel>
            {isCurrentUserOwner ? (
              <Input
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    updateNodeConfig(nodeId, { model });
                  }
                }}
                onBlur={() => {
                  updateNodeConfig(nodeId, { model });
                }}
              />
            ) : (
              <InputReadonly value={model} />
            )}
          </FormControl>
        </Section>
        <Section>
          {nodeConfig.outputs.map((output, i) => (
            <NodeOutputRow
              key={output.id}
              id={output.id}
              name={output.name}
              value={defaultVariableValueMap[output.id]}
            />
          ))}
        </Section>
      </NodeBox>
      {nodeConfig.outputs.map((output, i) => (
        <OutputHandle
          key={output.id}
          type="source"
          id={output.id}
          position={Position.Right}
          style={{
            bottom: calculateOutputHandleBottom(
              nodeConfig.outputs.length - 1 - i
            ),
          }}
        />
      ))}
    </>
  );
}
