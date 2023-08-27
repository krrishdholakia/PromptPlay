import re
from typing import Any, Callable

from llm import LlmMessage, get_completion
from pydantic import BaseModel
from termcolor import colored, cprint


class BlockBase(BaseModel):
    label: str | None = None
    input: dict | str | None = None
    func: Callable
    output: dict | str | None = None


class Databag(BlockBase):
    def __init__(
        self,
        value: Any,
        output: str,
        label: str | None = None,
    ):
        super().__init__(
            label=label,
            func=lambda: value,
            output=output,
        )


class DatabagLlmMessage(BlockBase):
    role: str
    content: str

    def __init__(
        self,
        role: str,
        output: str,
        content: str,
        input: str | None = None,
        label: str | None = None,
    ):
        if input == None:
            super().__init__(
                label=label,
                func=lambda: LlmMessage(role=role, content=content),
                output=output,
                role=role,
                content=content,
            )
        else:
            super().__init__(
                label=label,
                input=input,
                func=self._format_content,
                output=output,
                role=role,
                content=content,
            )

    def _format_content(self, **kwargs):
        return LlmMessage(
            role=self.role,
            content=self.content.format(**kwargs),
        )


class AppendToList(BlockBase):
    def __init__(
        self,
        item_name: str,
        list_name: str,
        output: str | None = None,
        label: str | None = None,
    ):
        super().__init__(
            label=label,
            input={**{item_name: "item"}, **{list_name: "target_list"}},
            func=self._append,
            output=output if output != None else list_name,
        )

    def _append(self, item, target_list):
        if target_list == None:
            target_list = []
        return target_list + [item] if item != None else target_list


class Llm(BlockBase):
    def __init__(
        self,
        input: str,
        output: str,
        label: str | None = None,
        model: str = "gpt-3.5-turbo",
        temperature: float = 1,
        stop: list[str] | None = None,
    ):
        super().__init__(
            label=label,
            input=input,
            func=lambda messages: get_completion(
                model=model,
                temperature=temperature,
                messages=messages,
                stop=stop,
            ),
            # func=lambda messages: messages[0],
            output=output,
        )


class Function(BlockBase):
    pass


class While(BaseModel):
    blocks: list[BlockBase]


class Breaker(BlockBase):
    def __init__(
        self,
        input: dict,
        pattern: str | None = None,
        tester: Callable | None = None,
    ):
        assert pattern != None or tester != None
        super().__init__(
            input=input,
            func=lambda value: re.search(pattern, value)
            if pattern
            else tester(value),
        )


class Printer(BlockBase):
    prefix: str

    def __init__(self, input: str, prefix: str = ""):
        super().__init__(
            input=input,
            func=self._print,
            prefix=prefix,
        )

    def _print(self, value):
        print(end="\n\n")
        cprint(f"{self.prefix}{value}", "white", "on_green")
        print(end="\n\n")


class UserInput(BlockBase):
    def __init__(
        self,
        output: str,
        label: str | None = None,
    ):
        super().__init__(
            label=label,
            func=lambda: input("Please enter the message:\n"),
            output=output,
        )


class GetAttribute(BlockBase):
    def __init__(
        self,
        attribute: str,
        input: str,
        output: str,
        label: str | None = None,
    ):
        super().__init__(
            label=label,
            input=input,
            func=lambda value: self._get_attribute(value, attribute),
            output=output,
        )

    def _get_attribute(self, value, attr):
        return getattr(value, attr, None)
