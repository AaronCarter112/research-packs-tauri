from pydantic import BaseModel
from typing import List, Optional
class ProjectSettings(BaseModel):
    name: str
    description: Optional[str] = None
    translate: bool = True
    extractive: bool = False
    scheduled: bool = False
    export_folder: Optional[str] = None
class Sources(BaseModel):
    items: List[str]
class QueueStart(BaseModel):
    project_id: Optional[int] = None
    limit: Optional[int] = 10
class ExportRequest(BaseModel):
    project_id: Optional[int] = None
    formats: List[str] = ['csv','json','md']
    range: Optional[str] = 'last_run'
    from_dt: Optional[str] = None
    to_dt: Optional[str] = None
