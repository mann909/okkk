from django.urls import path
from .views import *

urlpatterns = [
    path("user/signup", UserSignupView.as_view()),
    path("user/signin", UserSigninView.as_view()),
    path("user/getUser", GetUserView.as_view()),
    path('chat/createChatGroup', CreateChatGroup.as_view()),
    path('chat/<str:chat_name>/postMessage', PostMessageView.as_view()),
    path('chat/getChats/<str:chat_name>', GetChatsView.as_view()),
]