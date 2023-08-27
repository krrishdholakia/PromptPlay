import openai
from pydantic import BaseModel, parse_obj_as
from settings import settings

openai.api_key = settings.openai_api_key
openai.organization = settings.openai_organization_id


class LlmMessage(BaseModel):
    role: str
    content: str

    def __str__(self):
        return f"{self.role}: {self._truncate_string(self.content, 120)}"

    def __repr__(self):
        return f"LlmMessage(role={self.role}, content={self._truncate_string(self.content, 120)})"

    def _truncate_string(self, s: str, max_length: int):
        _s = repr(s)
        if len(_s) <= max_length:
            return _s
        # Half the remaining length (subtract the length of "......")
        half_length = (max_length - 6) // 2
        return _s[:half_length] + "......" + _s[-half_length:]


def get_completion(
    model: str,
    temperature: float,
    messages: list[LlmMessage],
    stop: list[str] | None = None,
) -> LlmMessage:
    response: dict = openai.ChatCompletion.create(
        model=model,
        temperature=temperature,
        messages=[m.dict() for m in messages],
        stop=stop,
    )

    print("OpenAI API usage: ", response["usage"])

    choice = response["choices"][0]
    return parse_obj_as(LlmMessage, choice["message"])
