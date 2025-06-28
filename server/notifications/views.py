from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets, exceptions
from mainproject.pagination import CustomPagination
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from .models import Notification
from .serializers import NotificationSerializer
from users.models import User
from django.db.models import Q


class NotificationView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def get_queryset(self):
        """Return notifications for the logged-in user, ordered by id (desc)."""
        return Notification.objects.filter(to_user=self.request.user).order_by("-id")

    def list(self, request, *args, **kwargs):
        """Override list to add 'noti_count' in the response."""
        response = super().list(request, *args, **kwargs)
        noti_count = Notification.objects.filter(
            to_user=request.user,
            user_has_seen=False
        ).count()
        if noti_count == 0:
            noti_count = None
        response.data = {
            "data": response.data,
            "noti_count": noti_count,
        }
        return response

    
class NotificationSeen(APIView):
    def get(self, request):
        notify_list = Notification.objects.filter(
            to_user=request.user,
            user_has_seen=False
        )
        for i in notify_list:
            i.user_has_seen = True
            i.save()
        Notification.objects.filter(
            Q(notification_type='M',
              to_user=request.user,
              ) 
        ).delete()
        return Response({"user_seen": True})
    
    def post(self,request):
        data = request.data
        notification = get_object_or_404(Notification,id=data.get('notify_id'))
        if notification.to_user == request.user:
            notification.user_has_seen =  True
            notification.delete()
            return Response({"notification_deleted": True})
