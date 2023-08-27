import { ReactElement } from "react";
import { useRecoilValue } from "recoil";
import {
  EditorElementType,
  selectedElementTypeState,
} from "../../../state/store";
import BlockSetEditor from "./BlockSetEditor";
import CompleterBlockEditor from "./CompleterBlockEditor";
import PromptBlockEditor from "./PromptBlockEditor";
import "./Editor.css";

export default function Editor() {
  const selectedElementType = useRecoilValue(selectedElementTypeState);

  let editorBody: ReactElement | null;

  switch (selectedElementType) {
    case EditorElementType.Prompt:
      editorBody = <PromptBlockEditor />;
      break;
    case EditorElementType.Completer:
      editorBody = <CompleterBlockEditor />;
      break;
    case EditorElementType.BlockSet:
      editorBody = <BlockSetEditor />;
      break;
    default:
      editorBody = null;
      break;
  }

  return (
    <div className="Editor">
      <div className="Editor_box">{editorBody}</div>
    </div>
  );
}