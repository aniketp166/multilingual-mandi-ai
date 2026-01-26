from typing import Dict, List
from fastapi import WebSocket
import json
import asyncio

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.negotiation_rooms: Dict[str, List[str]] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        print(f"Client {client_id} connected")
    
    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        
        # Remove from all negotiation rooms
        for room_id, clients in self.negotiation_rooms.items():
            if client_id in clients:
                clients.remove(client_id)
        
        print(f"Client {client_id} disconnected")
    
    async def join_negotiation(self, client_id: str, negotiation_id: str):
        if negotiation_id not in self.negotiation_rooms:
            self.negotiation_rooms[negotiation_id] = []
        
        if client_id not in self.negotiation_rooms[negotiation_id]:
            self.negotiation_rooms[negotiation_id].append(client_id)
        
        print(f"Client {client_id} joined negotiation {negotiation_id}")
    
    async def broadcast_to_negotiation(self, negotiation_id: str, message: dict):
        if negotiation_id in self.negotiation_rooms:
            for client_id in self.negotiation_rooms[negotiation_id]:
                if client_id in self.active_connections:
                    try:
                        await self.active_connections[client_id].send_text(
                            json.dumps(message)
                        )
                    except Exception as e:
                        print(f"Error sending message to {client_id}: {e}")
                        self.disconnect(client_id)
    
    async def send_personal_message(self, client_id: str, message: dict):
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].send_text(
                    json.dumps(message)
                )
            except Exception as e:
                print(f"Error sending personal message to {client_id}: {e}")
                self.disconnect(client_id)