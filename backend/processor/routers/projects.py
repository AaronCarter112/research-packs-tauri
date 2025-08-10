from fastapi import APIRouter
from ..settings import ProjectSettings
from .. import db
router=APIRouter(prefix='/projects', tags=['projects'])
@router.post('')
def create_project(p: ProjectSettings):
    with db.get_conn() as c:
        c.execute("INSERT OR REPLACE INTO projects(name, description, translate, extractive, scheduled, export_folder) VALUES(?,?,?,?,?,?)",
                  (p.name, p.description, int(p.translate), int(p.extractive), int(p.scheduled), p.export_folder))
    return p.model_dump()
@router.get('')
def list_projects():
    with db.get_conn() as c:
        rows=c.execute('SELECT * FROM projects ORDER BY id DESC').fetchall()
        return [dict(r) for r in rows]
