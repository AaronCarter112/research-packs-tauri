import asyncio
class RunManager:
    def __init__(self): self.cancel_event=asyncio.Event()
    def cancel(self): self.cancel_event.set()
    def clear(self): self.cancel_event.clear()
    def is_cancelled(self)->bool: return self.cancel_event.is_set()
RUN=RunManager()
