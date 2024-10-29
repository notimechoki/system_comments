import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Comment
from .serializers import CommentSerializer

class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Connected to WebSocket")
        await self.accept()

    async def receive(self, text_data):
        print("Received message:", text_data)
        data = json.loads(text_data)
        comment = await self.create_comment(data)
        await self.send(json.dumps(comment))
    
    async def disconnect(self, close_code):
        print(f"Websocket discconected with code {close_code}")

    @database_sync_to_async
    def create_comment(self, data):
        parent_id = data.get('parent')
        parent = Comment.objects.get(id=parent_id) if parent_id else None
        image = data.get('image')
        text_file = data.get('text_file')
        comment = Comment.objects.create(
            username=data['username'],
            email=data['email'],
            text=data['text'],
            parent=parent,
            image=image,
            text_file=text_file
        )
        return CommentSerializer(comment).data