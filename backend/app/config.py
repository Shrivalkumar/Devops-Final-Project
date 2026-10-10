from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "DeployFlow API"
    database_url: str = "postgresql+psycopg://deployflow:deployflow-local@localhost:5432/deployflow"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
