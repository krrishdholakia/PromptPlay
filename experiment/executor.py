import pprint

from blocks import BlockBase, Breaker, While
from termcolor import colored, cprint

_pp = pprint.PrettyPrinter(indent=2, width=120)


def execute(
    schema: list[BlockBase | While],
    is_debug: bool = False,
    **kwargs,
):
    scope = {**kwargs}
    _execute(schema=schema, scope=scope, is_debug=is_debug)
    return scope


def _get_scope_key(label: str | None, key: str) -> str:
    if key.find(".") > -1:
        return key
    elif label == None:
        return key
    else:
        return f"{label}.{key}"


def _execute(
    schema: list[BlockBase | While],
    scope: dict,
    is_debug: bool = False,
    indent: int = 0,
) -> bool:
    for index, block in enumerate(schema):
        if is_debug:
            print(end="\n\n")
            cprint(
                f"#{index} executing {block.__class__.__name__}",
                "white",
                "on_cyan",
            )

        if isinstance(block, While):
            if is_debug:
                cprint("entering While", "white", "on_magenta")
            while True:
                should_break = _execute(
                    schema=block.blocks,
                    scope=scope,
                    is_debug=is_debug,
                    indent=indent + 2,
                )
                if should_break:
                    if is_debug:
                        cprint("breaking While", "white", "on_magenta")
                    break
                if is_debug:
                    cprint("continue While", "white", "on_magenta")
            continue

        if block.input != None:
            if is_debug:
                cprint("input:", "white", "on_blue")

            if isinstance(block.input, dict):
                kwargs = {
                    arg_name: scope.get(name_on_scope, None)
                    for name_on_scope, arg_name in block.input.items()
                }
                if is_debug:
                    _pp.pprint(kwargs)
                out = block.func(**kwargs)
            else:
                arg = scope.get(block.input, None)
                if is_debug:
                    _pp.pprint(arg)
                out = block.func(arg)

            if isinstance(block, Breaker):
                if out:
                    return True
                else:
                    continue
        else:
            if is_debug:
                cprint("no input", "white", "on_blue")
            out = block.func()

        if block.output != None:
            if is_debug:
                cprint("output", "white", "on_yellow")
                _pp.pprint(out)

            if isinstance(block.output, dict):
                for name_on_return, name_on_scope in block.output.items():
                    scope[_get_scope_key(block.label, name_on_scope)] = getattr(
                        out, name_on_return, None
                    )
            else:
                scope[_get_scope_key(block.label, block.output)] = out
        else:
            if is_debug:
                cprint("no output", "white", "on_yellow")

    return False
