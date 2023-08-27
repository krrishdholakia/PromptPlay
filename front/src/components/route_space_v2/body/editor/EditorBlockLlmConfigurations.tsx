import {
  missingOpenAiApiKeyState,
  openAiApiKeyState,
} from "../../../../state/store";
import { LLM_STOP_NEW_LINE_SYMBOL } from "../../../../static/blockConfigs";
import { Block, LlmModel, SpaceContent } from "../../../../static/spaceTypes";
import {
  FieldHelperText,
  FieldRow,
  FieldTitle,
} from "./editorCommonComponents";
import Checkbox from "@mui/joy/Checkbox";
import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";

type Props = {
  model: LlmModel;
  onSaveModel: (model: LlmModel) => void;
  temperature: number;
  onSaveTemperaturel: (temperature: number) => void;
  stop: Array<string>;
  onSaveStop: (stop: Array<string>) => void;
  alsoOutputContent: boolean;
  onSaveAlsoOutputContent: (alsoOutputContent: boolean) => void;
  contentName: string | null;
  onSaveContentName: (contentName: string) => void;
  selectedBlock: Block;
  spaceId: string;
  spaceContent: SpaceContent;
};

export default function EditorBlockLlmConfigurations(props: Props) {
  const [openAiApiKey, setOpenAiApiKey] = useRecoilState(openAiApiKeyState);
  const [missingOpenAiApiKey, setMissingOpenAiApiKey] = useRecoilState(
    missingOpenAiApiKeyState
  );

  const [model, setModel] = useState(props.model);
  const [temperature, setTemperature] = useState(props.temperature);
  const [stop, setStop] = useState(props.stop);
  const [alsoOutputContent, setAlsoOutputContent] = useState(
    props.alsoOutputContent
  );
  const [contentName, setContentName] = useState(props.contentName ?? "");

  const onSaveStop = useCallback(() => {
    if (stop.length === 0) {
      props.onSaveStop([]);
    } else if (stop[0] === "") {
      props.onSaveStop([]);
    } else {
      props.onSaveStop(stop);
    }
  }, [stop, props]);

  return (
    <>
      <FieldRow>
        <FieldTitle>OpenAI API Key</FieldTitle>
        <Input
          color={missingOpenAiApiKey ? "danger" : "neutral"}
          size="sm"
          variant="outlined"
          value={openAiApiKey}
          onChange={(e) => {
            setOpenAiApiKey(e.target.value);
            setMissingOpenAiApiKey(false);
          }}
        />
        {missingOpenAiApiKey && (
          <FieldHelperText $type="error">
            Must specify an Open AI API key here.
          </FieldHelperText>
        )}
        <FieldHelperText $type="success">
          This is stored in the your browser, never uploaded.
        </FieldHelperText>
      </FieldRow>
      <FieldRow>
        <FieldTitle>Model</FieldTitle>
        <Select
          size="sm"
          variant="outlined"
          value={model}
          onChange={(e, value) => {
            setModel(value!);
            props.onSaveModel(value!);
          }}
        >
          <Option value={LlmModel.GPT3_5_TURBO}>{LlmModel.GPT3_5_TURBO}</Option>
          <Option value={LlmModel.GPT4}>{LlmModel.GPT4}</Option>
        </Select>
      </FieldRow>
      <FieldRow>
        <FieldTitle>Temperature</FieldTitle>
        <Input
          color="neutral"
          size="sm"
          variant="outlined"
          type="number"
          slotProps={{ input: { min: 0, max: 2, step: 0.1 } }}
          value={temperature}
          onChange={(e) => {
            setTemperature(Number(e.target.value));
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              props.onSaveTemperaturel(temperature);
            }
          }}
          onBlur={() => props.onSaveTemperaturel(temperature)}
        />
      </FieldRow>
      <FieldRow>
        <FieldTitle>Stop</FieldTitle>
        <Input
          color="neutral"
          size="sm"
          variant="outlined"
          value={
            stop.length ? stop[0].replace("\n", LLM_STOP_NEW_LINE_SYMBOL) : ""
          }
          onKeyDown={(event) => {
            if (event.shiftKey && event.key === "Enter") {
              event.preventDefault();
              setStop((stop) => (stop.length ? [stop[0] + "\n"] : ["\n"]));
            }
          }}
          onChange={(e) => {
            setStop([e.target.value]);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              onSaveStop();
            }
          }}
          onBlur={() => onSaveStop()}
        />
        <FieldHelperText>
          Use <code>SHIFT</code> + <code>ENTER</code> to enter a new line
          character. (Visually represented by{" "}
          <code>"{LLM_STOP_NEW_LINE_SYMBOL}"</code>.)
        </FieldHelperText>
      </FieldRow>
      <FieldRow>
        <Checkbox
          color="neutral"
          size="sm"
          variant="outlined"
          label="Also output content"
          checked={alsoOutputContent}
          onChange={(e) => {
            setAlsoOutputContent(e.target.checked);
            props.onSaveAlsoOutputContent(e.target.checked);
          }}
        />
      </FieldRow>
      {alsoOutputContent && (
        <FieldRow>
          <FieldTitle>List name</FieldTitle>
          <Input
            color="neutral"
            size="sm"
            variant="outlined"
            value={contentName}
            onChange={(e) => {
              setContentName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                props.onSaveContentName(contentName);
              }
            }}
            onBlur={() => props.onSaveContentName(contentName)}
          />
        </FieldRow>
      )}
    </>
  );
}
