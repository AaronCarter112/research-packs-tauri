import asyncio, json
class EventBus:
    def __init__(self): self._subs=set()
    async def publish(self, data: dict): msg=json.dumps(data); 
        # deliver without awaiting all
        for q in list(self._subs):
            try: await q.put(msg)
            except Exception: pass
    async def subscribe(self):
        q=asyncio.Queue(); self._subs.add(q)
        try: yield q
        finally: self._subs.discard(q)
BUS=EventBus()
