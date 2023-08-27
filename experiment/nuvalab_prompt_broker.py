import inspect
import pprint

from blocks import (
    AppendToList,
    Breaker,
    Databag,
    DatabagLlmMessage,
    GetAttribute,
    Llm,
    Printer,
    UserInput,
    While,
)
from executor import execute
from nuvalab_prompt_elon import memories as elon_memories

system_template = inspect.cleandoc(
    """
    # Instruction:
    Your task as an expert judge is to analyze the `Event History` and compare it with the `Objective Criteria`. Only use facts mentioned in `Event History` as the single source of ground truth.

    - If the `Event History` met given objective criteria, set `objective_met` to `True`.
    - If not, set `objective_met` to `False`.

    By default, `metadata` is set to `null` unless provided in detail in `Objective Criteria`.

    Provide your result in a JSON format as follows:

    ```
    {{"objective_met": <objective_met>, "metadata": <metadata>}}
    ```

    ## Examples:

    ```
    {{"objective_met": "True", "metadata": "null"}}
    ```
    ```
    {{"objective_met": "False", "metadata": "null"}}
    ```
    ```
    """
)

broker_user_message_template = inspect.cleandoc(
    """
    # Event History:
    {context}
    """
)

broker_user_instruction_template = inspect.cleandoc(
    """
    # Objective Criteria:
    {objective_criteria}
    """
)

objective_criteria = inspect.cleandoc(
    """
    The objective criteria will be considered as met if ALL of the following conditions are satisfied:
    - Anyone found the newspaper.
    - Anyone mentioned the date or year on the newspaper.
    - Anyone suggested they might have time traveled.
    """
)

schema = [
    Databag(value=elon_memories, output="context"),
    Databag(value=objective_criteria, output="objective_criteria"),
    # system
    DatabagLlmMessage(
        role="system",
        content=system_template,
        output="system_message",
    ),
    AppendToList(
        item_name="system_message",
        list_name="messages",
    ),
    # user message
    DatabagLlmMessage(
        input={"context": "context"},
        role="user",
        content=broker_user_message_template,
        output="user_message_1",
    ),
    AppendToList(
        item_name="user_message_1",
        list_name="messages",
    ),
    # user message
    DatabagLlmMessage(
        input={"objective_criteria": "objective_criteria"},
        role="user",
        content=broker_user_instruction_template,
        output="user_message_2",
    ),
    AppendToList(
        item_name="user_message_2",
        list_name="messages",
    ),
    # Fire the LLM call
    Llm(
        input="messages",
        # model="gpt-4",
        output={"content": "content"},
    ),
    # Output the result
    Printer(input="content", prefix="##### LLM Output:\n"),
]

if __name__ == "__main__":
    result = execute(schema=schema, is_debug=False)
    pp = pprint.PrettyPrinter(indent=2, width=80)
    pp.pprint(result)
