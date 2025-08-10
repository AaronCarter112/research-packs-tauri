# LLM Providers
- RP_LLM_PROVIDER: local | openai | lmstudio | hf
OpenAI-compatible:
- OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL
Hugging Face:
- HUGGINGFACEHUB_API_TOKEN, HF_MODEL
Runtime override:
POST /config/llm with JSON { provider, openai_base, openai_model }
