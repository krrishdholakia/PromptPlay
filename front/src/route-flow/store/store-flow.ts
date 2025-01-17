import { pipe, A, F, flow, D } from "@mobily/ts-belt";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createClientSlice } from "./store-client-slice";
import { createCsvEvaluationPresetSlice } from "./store-csv-evaluation-preset-slice";
import { createFlowServerSlice } from "./store-flow-server-slice";
import {
  FlowInputItem,
  FlowOutputItem,
  InputNodeConfig,
  NodeType,
  OutputNodeConfig,
} from "./types-flow-content";
import { FlowState } from "./types-local-state";

export const useFlowStore = create<FlowState>()(
  devtools(
    (...a) => ({
      ...createClientSlice(...a),
      ...createFlowServerSlice(...a),
      ...createCsvEvaluationPresetSlice(...a),
    }),
    {
      store: "FlowState",
      anonymousActionType: "setState",
    }
  )
);

const memoizeItems = F.memoizeWithKey(
  (items) => JSON.stringify(items),
  F.identity
);

export function flowInputItemsSelector(state: FlowState): FlowInputItem[] {
  const { nodes, nodeConfigs } = state;

  return pipe(
    nodes,
    A.filter(flow(D.get("type"), F.equals(NodeType.InputNode))),
    A.map((node) => nodeConfigs[node.id] as InputNodeConfig),
    A.map(D.getUnsafe("outputs")),
    A.flat,
    memoizeItems
  );
}

export function flowInputItemsWithNodeConfigSelector(
  state: FlowState
): { inputItem: FlowInputItem; nodeConfig: InputNodeConfig }[] {
  const { nodes, nodeConfigs } = state;

  return pipe(
    nodes,
    A.filter(flow(D.get("type"), F.equals(NodeType.InputNode))),
    A.map((node) => nodeConfigs[node.id] as InputNodeConfig),
    A.map((nodeConfig) =>
      A.map(nodeConfig.outputs, (o) => ({ inputItem: o, nodeConfig }))
    ),
    A.flat
  );
}

export function flowOutputItemsSelector(state: FlowState): FlowOutputItem[] {
  const { nodes, nodeConfigs } = state;

  return pipe(
    nodes,
    A.filter(flow(D.get("type"), F.equals(NodeType.OutputNode))),
    A.map((node) => nodeConfigs[node.id] as OutputNodeConfig),
    A.map((nodeConfig) => nodeConfig.inputs),
    A.flat,
    memoizeItems
  );
}
