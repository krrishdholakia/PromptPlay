import styled from "@emotion/styled";
import IconButton from "@mui/joy/IconButton";
import { ReactNode } from "react";
import CrossIcon from "../../component-icons/CrossIcon";
import { useFlowStore } from "../store/store-flow";
import { FlowState } from "../store/types-local-state";
import { DetailPanelContentType } from "../store/types-local-state";
import PanelChatGPTMessageConfig from "./chat-gpt-message-config/PanelChatGPTMessageConfig";
import PanelEvaluationModeCSV from "./csv-evaluation/PanelEvaluationModeCSV";
import PanelNodeConfig from "./node-config/PanelNodeConfig";
import PanelEvaluationModeSimple from "./simple-evaluaton/PanelEvaluationModeSimple";

const selector = (state: FlowState) => ({
  detailPanelContentType: state.detailPanelContentType,
  setDetailPanelContentType: state.setDetailPanelContentType,
});

export default function SidePanel() {
  const { detailPanelContentType, setDetailPanelContentType } =
    useFlowStore(selector);

  let content: ReactNode;
  switch (detailPanelContentType) {
    case DetailPanelContentType.Off: {
      break;
    }
    case DetailPanelContentType.NodeConfig: {
      content = <PanelNodeConfig />;
      break;
    }
    case DetailPanelContentType.EvaluationModeSimple: {
      content = <PanelEvaluationModeSimple />;
      break;
    }
    case DetailPanelContentType.EvaluationModeCSV: {
      content = <PanelEvaluationModeCSV />;
      break;
    }
    case DetailPanelContentType.ChatGPTMessageConfig: {
      content = <PanelChatGPTMessageConfig />;
      break;
    }
  }

  return (
    <Container $hide={detailPanelContentType === DetailPanelContentType.Off}>
      <StyledCloseButtonWrapper>
        <IconButton
          size="md"
          onClick={() => setDetailPanelContentType(DetailPanelContentType.Off)}
        >
          <StyledIconCross />
        </IconButton>
      </StyledCloseButtonWrapper>
      <Content>{content}</Content>
    </Container>
  );
}

const Container = styled.div<{ $hide: boolean }>`
  position: relative;
  height: 100%;
  background-color: #fff;
  border-left: 1px solid #ddd;
  display: ${(props) => (props.$hide ? "none" : "initial")};
`;

const StyledCloseButtonWrapper = styled.div`
  position: absolute;
  top: 5px;
  left: -45px;
`;

const StyledIconCross = styled(CrossIcon)`
  width: 16px;
`;

const Content = styled.div`
  height: 100%;
  overflow-y: auto;
`;
