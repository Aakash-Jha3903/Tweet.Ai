# grok_ai/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status

from google import genai
from django.conf import settings

from users.models import User
from .serializers import GrokChatRoomSerializer, GrokChatMessageSerializer
from .models import GrokChatRoom, GrokChatMessage

class GrokChatRoomListCreateView(generics.ListCreateAPIView):
    serializer_class = GrokChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return GrokChatRoom.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GrokChatRoomDetailView(generics.RetrieveAPIView):
    queryset = GrokChatRoom.objects.all()
    serializer_class = GrokChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return GrokChatRoom.objects.filter(user=self.request.user)
    

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def Grok_send_prompt_to_room(request, room_id):
    prompt = request.data.get('prompt', '')
    room = GrokChatRoom.objects.get(id=room_id, user=request.user)

    # Save user message
    GrokChatMessage.objects.create(room=room, sender='user', message=prompt)

    client = genai.Client(api_key=settings.LLM_API_KEY)
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        ai_response = response.text

        # Save AI response
        GrokChatMessage.objects.create(room=room, sender='ai', message=ai_response)

        return Response({'response': ai_response})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

