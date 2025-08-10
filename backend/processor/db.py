import sqlite3, pathlib, os
DB_PATH=os.getenv('RP_DB_PATH', str(pathlib.Path(__file__).resolve().parents[2]/'database'/'research_packs.db'))
def get_conn():
    conn=sqlite3.connect(DB_PATH); conn.row_factory=sqlite3.Row; return conn
def migrate():
    schema=pathlib.Path(__file__).resolve().parents[2]/'database'/'schema.sql'
    with get_conn() as c, open(schema,'r',encoding='utf-8') as f: c.executescript(f.read())
