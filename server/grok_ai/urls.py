# grok_ai/urls.py
from django.urls import path
from .views import GrokChatRoomListCreateView, GrokChatRoomDetailView, Grok_send_prompt_to_room

urlpatterns = [
    path("grok-chatrooms/", GrokChatRoomListCreateView.as_view(), name="grok-chatroom-list-create"),
    path("grok-chatrooms/<int:pk>/", GrokChatRoomDetailView.as_view(), name="grok-chatroom-detail"),
    path("grok-chatrooms/<int:room_id>/prompt/",Grok_send_prompt_to_room,name="grok-send-prompt-to-room",),
]