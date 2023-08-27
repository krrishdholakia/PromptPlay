from pydantic import BaseSettings


class Settings(BaseSettings):
    openai_organization_id: str
    openai_api_key: str

    class Config:
        # `.env.local` takes priority over `.env`
        env_file = ".env", ".env.local"


settings = Settings()
