import inspect

system_template = inspect.cleandoc(
    """
    # Character background:
    {character_background}

    # Character memory:
    {character_memory}

    # General Instructions:
    Speak and act in accordance to current objective below.
    {instruction}

    # Current objective:
    {current_objective}

    # Response Format:
    return `action_type` and `action_content` together in the following JSON format:

    ```
    {{"action_type": <action_type>, "action_content": <content>}}
    ```

    ## Examples:
    ```
    {{"action_type": "SPEAK", "action_content": "Jensen, your attempts at mockery are amusing."}}
    ```

    ```
    {{"action_type": "EXAMINE", "action_content": "Newspaper"}}
    ```

    ```
    {{"action_type": "WALK_TO", "action_content": "Table"}}
    ```

    ## Conversations:
    """
)

story_background = inspect.cleandoc(
    """
    Billionaire tech CEO rivals Elon Musk, Mark Zuckerberg, and Jensen Huang get transported back in time over 100 years to the Wild West after a tech conference accident.

    They crash land into the dirt outside of a saloon in the small western frontier town of LLaMA Land. Dazed, they stare in shock at the old-fashioned wood buildings, horses, and dirt roads - a far cry from the modern world they know. They also transformed their appearances just like others in the town, except still being a modern person at heart. The town locals gawk at these three oddly-dressed strangers and their weird devices.
    """
)
