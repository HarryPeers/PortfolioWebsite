import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
from os import path, getcwd, listdir

app = FastAPI()
app.cwd = getcwd()

@app.get("/")
def stylesheet(request:Request):
    return FileResponse(f"{app.cwd}/projects/portfolio/index.html")
    
@app.get("/stylesheet/{project}/{file}")
def stylesheet(request:Request, project, file):
    local_path = f"{app.cwd}/stylesheets/{project}/{file}"
    if path.exists(local_path):
        return FileResponse(local_path)
    raise HTTPException(404, "File not found!")

@app.get("/script/{project}/{file}")
def script(request:Request, project, file):
    local_path = f"{app.cwd}/scripts/{project}/{file}"
    if path.exists(local_path):
        return FileResponse(local_path)
    raise HTTPException(404, "File not found!")

@app.get("/resource/{project}/{file}")
def resource(request:Request, project, file):
    local_path = f"{app.cwd}/resources/{project}/{file}"
    if path.exists(local_path):
        return FileResponse(local_path)
    raise HTTPException(404, "File not found!")

@app.get("/font/{file}")
def font(request:Request, file):
    local_path = f"{app.cwd}/fonts/{file}"
    if path.exists(local_path):
        return FileResponse(local_path)
    raise HTTPException(404, "File not found!")

for file in listdir(f"{app.cwd}/routers/"):
    if file.endswith(".py") and not file.startswith("_"):
        exec(f"from routers.{file.split('.')[0]} import router;app.include_router(router)")

if __name__ == "__main__":
    uvicorn.run("index:app", host="127.0.0.1", port=9059)