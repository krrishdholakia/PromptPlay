import { useNodeId } from "reactflow";
import styled from "styled-components";
import IconInspect from "../../../icons/IconInspect";
import { FlowState, useFlowStore } from "../../flowState";
import { DetailPanelContentType } from "../../flowTypes";
import { ROW_MARGIN_TOP } from "./NodeInputModifyRow";

export const VARIABLE_LABEL_HEIGHT = 32;

const Container = styled.div`
  margin-bottom: ${ROW_MARGIN_TOP}px;
  display: flex;
  gap: 5px;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Content = styled.div`
  height: ${VARIABLE_LABEL_HEIGHT}px;
  padding: 0 10px;
  border: 1px solid blue;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  min-width: 0;
  flex-grow: 1;
`;

const Name = styled.code`
  white-space: nowrap;
`;

const Value = styled.code`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const InspectIcon = styled(IconInspect)`
  width: 25px;
  height: 25px;
  flex-shrink: 0;
  cursor: pointer;
`;

const selector = (state: FlowState) => ({
  setDetailPanelContentType: state.setDetailPanelContentType,
  setDetailPanelSelectedNodeId: state.setDetailPanelSelectedNodeId,
});

type Props = {
  id: string;
  name: string;
  value: string;
};

export default function NodeOutputRow(props: Props) {
  const { setDetailPanelContentType, setDetailPanelSelectedNodeId } =
    useFlowStore(selector);

  const nodeId = useNodeId()!;

  return (
    <Container>
      <Content>
        <Name>{props.name} =&nbsp;</Name>
        <Value>{JSON.stringify(props.value)}</Value>
      </Content>
      <InspectIcon
        onClick={() => {
          setDetailPanelContentType(DetailPanelContentType.NodeOutput);
          setDetailPanelSelectedNodeId(nodeId);
        }}
      />
    </Container>
  );
}