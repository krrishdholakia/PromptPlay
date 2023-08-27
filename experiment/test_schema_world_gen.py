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

world_desc_instruction = inspect.cleandoc(
    """
    Write a description of a fantasy world in fewer than 50 words. \
    Focus on the information of the terrain and weather.
    """
)

gen_tile_system = inspect.cleandoc(
    """
    You are a game level designer that uses ascii art to design tilemaps for environments based on the requirement provided.

    The tilemap is composed of tiles. The tilemap is 5 by 5. Each cell is a square tile. Each tile is a single upper case letter that representing a type of terrain:

    - G: grass
    - S: snow
    - D: dirt
    - R: rock
    - O: road
    - W: water
    - C: ice
    - F: fire

    Add some randomization when filling the 5 x 5 square tilemap based on the description. For example:

    Requirement:
    A sprawling fantasy realm with snow-capped peaks, lush forests, and golden deserts. Its ever-changing weather creates mesmerizing storms, shimmering rainbows, and glowing auroras. From serene lakes to treacherous cliffs, this diverse land is a haven for adventurers seeking both tranquility and thrilling challenges.

    Tilemap:
    SSSSS
    SWWWW
    WWWWW
    SWSSS
    SSSSS
    """
)


schema = [
    DatabagLlmMessage(
        role="user",
        content=world_desc_instruction,
        output="gen_world_desc_user_message",
    ),
    AppendToList(
        item_name="gen_world_desc_user_message",
        list_name="gen_world_desc_messages",
    ),
    Llm(input="gen_world_desc_messages", output={"content": "world_desc"}),
    Printer(input="world_desc", prefix="##### Work description:\n"),
    DatabagLlmMessage(
        role="system", content=gen_tile_system, output="gen_tile_system_message"
    ),
    AppendToList(
        item_name="gen_tile_system_message", list_name="gen_tile_messages"
    ),
    DatabagLlmMessage(
        input={"world_desc": "description"},
        role="user",
        content=inspect.cleandoc(
            """
            Requirement:
            {description}

            Tilemap:
            """
        ),
        output="gen_tile_user_message",
    ),
    AppendToList(
        item_name="gen_tile_user_message", list_name="gen_tile_messages"
    ),
    Llm(input="gen_tile_messages", output={"content": "tile_map"}),
    Printer(input="tile_map", prefix="##### Tile map:\n"),
]

result = execute(schema=schema, is_debug=False)
pp = pprint.PrettyPrinter(indent=2, width=80)
pp.pprint(result)
