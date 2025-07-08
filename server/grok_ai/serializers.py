# grok_ai/serializers.py
from rest_framework import serializers
from .models import GrokChatRoom, GrokChatMessage

class GrokChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrokChatMessage
        fields = ['id', 'sender', 'message', 'timestamp']

class GrokChatRoomSerializer(serializers.ModelSerializer):
    messages = GrokChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = GrokChatRoom
        fields = ['id', 'name', 'created_at', 'messages']