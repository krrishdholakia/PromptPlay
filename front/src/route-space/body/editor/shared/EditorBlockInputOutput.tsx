import styled from "@emotion/styled";
import Button from "@mui/joy/Button";
import { customAlphabet } from "nanoid";
import { append, equals, reject, update } from "ramda";
import { ReactNode } from "react";
import u from "updeep";
import { useMutation } from "urql";
import { UPDATE_SPACE_CONTENT_MUTATION } from "../../../../state/spaceGraphQl";
import { Block, SpaceContent } from "../../../../static/spaceTypes";
import EditorSingleScopeVariable from "./EditorSingleScopeVariable";
import EditorVariableMapRow from "./EditorVariableMapRow";

const nanoid = customAlphabet("1234567890abcdef", 6);

const Container = styled.div`
  margin-bottom: 10px;
`;

const Header = styled.div`
  margin-bottom: 5px;
`;

type Props = {
  isReadOnly: boolean;
  block: Block;
  isInput: boolean;
  spaceId: string;
  spaceContent: SpaceContent;
} & (
  | {
      singleVariable: string;
    }
  | {
      variableMap: Array<[string, string]>;
    }
);

export default function EditorBlockInputOutput(props: Props) {
  const [, updateSpaceV2] = useMutation(UPDATE_SPACE_CONTENT_MUTATION);

  const rows: ReactNode[] = [];

  if ("singleVariable" in props) {
    rows.push(
      <EditorSingleScopeVariable
        key={`${props.block.id}-single-variable`}
        isReadOnly={props.isReadOnly}
        variableName={props.singleVariable}
        isInput={props.isInput}
        onSave={(newName) => {
          const newContent = u({
            components: {
              [props.block.id]: {
                [props.isInput ? "singleInput" : "singleOuput"]: newName,
              },
            },
          })(props.spaceContent) as SpaceContent;

          updateSpaceV2({
            spaceId: props.spaceId,
            content: JSON.stringify(newContent),
          });
        }}
      />
    );
  } else {
    for (const [index, [left, right]] of props.variableMap.entries()) {
      // They key must contain block.id, so that when selecting a different
      // block, this field will be updated.
      rows.push(
        <EditorVariableMapRow
          key={`${props.block.id}-variable-map-row-${index}`}
          isReadOnly={props.isReadOnly}
          localName={props.isInput ? right : left}
          scopeName={props.isInput ? left : right}
          isInput={props.isInput}
          onSaveLocalName={(newValue) => {
            const newContent = u({
              components: {
                [props.block.id]: {
                  [props.isInput ? "inputMap" : "outputMap"]: update(
                    index,
                    props.isInput ? [left, newValue] : [newValue, right]
                  ),
                },
              },
            })(props.spaceContent) as SpaceContent;

            updateSpaceV2({
              spaceId: props.spaceId,
              content: JSON.stringify(newContent),
            });
          }}
          onSaveScopeName={(newValue) => {
            const newContent = u({
              components: {
                [props.block.id]: {
                  [props.isInput ? "inputMap" : "outputMap"]: update(
                    index,
                    props.isInput ? [newValue, right] : [left, newValue]
                  ),
                },
              },
            })(props.spaceContent) as SpaceContent;

            updateSpaceV2({
              spaceId: props.spaceId,
              content: JSON.stringify(newContent),
            });
          }}
          onRemove={() => {
            const newContent = u({
              components: {
                [props.block.id]: {
                  [props.isInput ? "inputMap" : "outputMap"]: reject(
                    equals([left, right])
                  ),
                },
              },
            })(props.spaceContent) as SpaceContent;

            updateSpaceV2({
              spaceId: props.spaceId,
              content: JSON.stringify(newContent),
            });
          }}
        />
      );
    }
  }

  let addButton: ReactNode | null = null;

  if (!props.isReadOnly && "variableMap" in props) {
    addButton = (
      <Button
        color="success"
        variant="outlined"
        onClick={() => {
          const id = nanoid();
          const localName = `local_${id}`;
          const scopeName = `scope_${id}`;

          const newContent = u({
            components: {
              [props.block.id]: {
                [props.isInput ? "inputMap" : "outputMap"]: append(
                  props.isInput
                    ? [scopeName, localName]
                    : [localName, scopeName]
                ),
              },
            },
          })(props.spaceContent) as SpaceContent;

          updateSpaceV2({
            spaceId: props.spaceId,
            content: JSON.stringify(newContent),
          });
        }}
      >
        Add
      </Button>
    );
  }

  return (
    <Container>
      <Header>{props.isInput ? "Input" : "Output"}</Header>
      <div>{rows}</div>
      {addButton}
    </Container>
  );
}
