import styled from "styled-components";

export const FieldRow = styled.div`
  margin-bottom: 10px;
`;

export const FieldTitle = styled.div`
  margin-bottom: 5px;
`;

export const FieldDescriptionText = styled.div`
  margin-bottom: 5px;
  font-size: 13px;
`;

export const FieldHelperText = styled.div<{ $type?: "error" | "success" }>`
  font-size: 12px;
  margin-top: 5px;
  color: ${(props) => {
    switch (props.$type) {
      case "error":
        return "#b02e2e";
      case "success":
        return "#179648";
      default:
        return "#545454";
    }
  }};
`;