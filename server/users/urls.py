from django.urls import path
from .views import (
    UsersList, UserDetailView, follow_unfollow, recommend_user, follow_user_list,
    user_followers_list, user_following_list
)

urlpatterns = [
    path('users/', UsersList.as_view()),
    path('recommend_users/forme/', recommend_user),
    path('recommend_users/userlist/', follow_user_list),
    path('user/me/follow_unfollow/', follow_unfollow),
    path('user/<username>/', UserDetailView.as_view()),
    path('user/<username>/followers/', user_followers_list),
    path('user/<username>/following/', user_following_list),
]
