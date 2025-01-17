import styled from "@emotion/styled";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 5px;
`;

type Props = {
  isReadOnly: boolean;
  scopeName: string;
  localName: string;
  isInput: boolean;
  onSaveScopeName: (value: string) => void;
  onSaveLocalName: (value: string) => void;
  onRemove: () => void;
};

export default function EditorVariableMapRow(props: Props) {
  const [localName, setLocalName] = useState(props.localName);
  const [scopeName, setScopeName] = useState(props.scopeName);

  if (props.isInput) {
    return (
      <Container>
        <Input
          color="primary"
          style={{ flexGrow: 1 }}
          disabled={props.isReadOnly}
          value={scopeName}
          onChange={(e) => {
            setScopeName(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              props.onSaveScopeName(scopeName);
            }
          }}
          onBlur={() => props.onSaveScopeName(scopeName)}
        />
        <Input
          color="primary"
          variant="solid"
          style={{ flexGrow: 1 }}
          disabled={props.isReadOnly}
          value={localName}
          onChange={(e) => {
            setLocalName(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              props.onSaveLocalName(localName);
            }
          }}
          onBlur={() => props.onSaveLocalName(localName)}
        />
        {props.isReadOnly ? null : (
          <Button color="danger" onClick={() => props.onRemove()}>
            Remove
          </Button>
        )}
      </Container>
    );
  } else {
    return (
      <Container>
        <Input
          color="primary"
          variant="solid"
          style={{ flexGrow: 1 }}
          disabled={props.isReadOnly}
          value={localName}
          onChange={(e) => {
            setLocalName(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              props.onSaveLocalName(localName);
            }
          }}
          onBlur={() => props.onSaveLocalName(localName)}
        />
        <Input
          color="primary"
          style={{ flexGrow: 1 }}
          disabled={props.isReadOnly}
          value={scopeName}
          onChange={(e) => {
            setScopeName(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              props.onSaveScopeName(scopeName);
            }
          }}
          onBlur={() => props.onSaveScopeName(scopeName)}
        />
        {props.isReadOnly ? null : (
          <Button color="danger" onClick={() => props.onRemove()}>
            Remove
          </Button>
        )}
      </Container>
    );
  }
}
