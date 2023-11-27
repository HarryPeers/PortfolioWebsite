from fastapi import APIRouter, Request, WebSocket, HTTPException
from fastapi.responses import FileResponse
from asyncio import sleep, create_task
from random import randint
from starlette.websockets import WebSocketDisconnect

global router
router = APIRouter()

global rooms
rooms = {}

"""

{'roomId': room object}

"""

def generate_uuid():
    return randint(1111111111,9999999999)

class member:
    def __init__(self, websocket:WebSocket):
        self.websocket = websocket
        self._username = None
        self.room = None
        self.uuid = generate_uuid()
        self.direction = None
        self.synced = False

        self.position = None
        self.body = []
        self.length = 0
        self.trail = []

        self.body = None
        self.snake = None

    @property
    def username(self):
        if self._username is None:
            return self.uuid
        return self._username
    
    @username.setter
    def username(self, value:str):
        self._username = value

    async def send(self, payload:dict):
        try:
            await self.websocket.send_json(payload)
        except WebSocketDisconnect:
            self.room.remove(self)

class room:
    def __init__(self, uuid:str):
        self.owner = None
        self.members = []
        self.uuid = uuid

        room.total_x = None
        room.total_y = None

    @property
    def characteristics(self) -> dict:
        pass

    async def append_member(self, member:member):
        
        await member.websocket.accept()

        if self.owner is None:
            self.owner = member.uuid
            create_task(self.tick_cycle())
        
        self.members.append(member)

        while True:
            try:
                payload = await member.websocket.receive_json()
            except WebSocketDisconnect:
                self.members.remove(member)
                if len(self.members) == 0:
                    del rooms[self.uuid]
                return
            else:
                await self.process_event(member, payload)
        
    async def process_event(self, member:member, payload:dict):
        for payload in payload:
            if "event" not in payload.keys():
                return
            event = payload["event"]

            if event == "register":
                member.username = payload["payload"]["username"]
                member.snake = payload["payload"]["snakeColour"]
                member.body = payload["payload"]["bodyColour"]
                await member.send([{"event": "registered", "payload": {"owner": member.uuid==self.owner, "id": member.uuid}}])
            elif event == "direction":
                member.direction = payload["payload"]["direction"]
            elif event == "position": 
                member.position = payload["payload"]["position"]
                member.body = []
                member.trail = []
            elif event == "length":
                member.length = payload["payload"]["length"]

    async def tick_cycle(self):
        from time import monotonic
        while True:
            await sleep(0.2) #Seconds not ms
            await create_task(self.sync_members())
        
    async def sync_members(self):
        for member in self.members:
            await self.sync_member(member)

    async def sync_member(self, member):
        if not member.synced:
            await member.send([{"event": "syncPlayers", "payload": {}}])
            member.synced = True

        if member.position is None:
            return
        elif member.direction == "N":
            member.position[1] -= 1
        elif member.direction == "E":
            member.position[0] += 1
        elif member.direction == "S":
            member.position[1] += 1
        elif member.direction == "W":
            member.position[0] -= 1

        member.trail.append([member.position.copy(), member.direction])

        if len(member.trail) > member.length:
            member.trail = member.trail[1:]

        print(member.trail)



@router.get("/projects/snake/")
def index(request:Request):
    return FileResponse(f"{request.app.cwd}/projects/snake/index.html")

@router.get("/projects/snake/room/{id}")
def index(request:Request):
    return FileResponse(f"{request.app.cwd}/projects/snake/multiplayer.html")

@router.get("/api/snake/room/")
def index(request:Request):
    return {room: [str(member.username) for member in rooms[room].members] for room in rooms.keys()}

@router.post("/api/snake/room/")
def create_room(request:Request):
    uuid = generate_uuid()
    rooms[str(uuid)] = None
    return {"Id": uuid}

@router.websocket("/api/snake/room/{uuid}")
async def room_gateway(websocket:WebSocket, uuid):
    if uuid not in rooms.keys():
        raise HTTPException(404, "Room not found!")
    elif rooms[uuid] is None:
        rooms[uuid] = room(uuid)

    client = member(websocket)
    client.room = rooms[uuid]
    await rooms[uuid].append_member(client)


"""
Docs (kinda)

Flow/Process for creating a game:

make a post request to /api/snake/room/ return a id,
redirect page to /projects/snake/room/{id},
connect to gateway (set first connection to owner of the room),
send register payload,
mark as complete and start displaying


For sending each players locations/positions. Owner will send their positions, and once recieved by each player they will respond with their own positions.

"""