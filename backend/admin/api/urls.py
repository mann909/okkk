from django.urls import path
from .views import *

urlpatterns = [
    path("user/signup", UserSignupView.as_view()),
    path("user/signin", UserSigninView.as_view()),
    path("user/getUser", GetUserView.as_view()),
    path("user/getUserById/<int:user_id>", GetUserByIdView.as_view()),
    path("user/setGender", SetGender.as_view()),
    path('user/files', UserFilesView.as_view()),
    path("user/users", UserView.as_view()),
    path("user/getAllBookmarks", GetAllBookmarkView.as_view()),
    path("user/updateBookmarkList", UpdateBookmarkView.as_view()),
    path('chat/createChatGroup', CreateChatGroup.as_view()),
    path('chat/getChatrooms', GetChatroomsView.as_view()),
    path('chat/<str:chat_name>/postMessage', PostMessageView.as_view()),
    path('chat/getChats/<str:chat_name>', GetChatsView.as_view()),
    path("file/postFile", PostFileView.as_view()),
    path('file/updateRating', UpdateRatingView.as_view()),
    path('file/updateViews', UpdateViewsView.as_view()),
    path('file/getFile/<int:file_id>', GetFileView.as_view()),
]