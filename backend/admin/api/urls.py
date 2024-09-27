from django.urls import path
from .views import *

urlpatterns = [
    path("user/signup", UserSignupView.as_view()),
    path("user/signin", UserSigninView.as_view()),
    path("user/getUser", GetUserView.as_view())
]