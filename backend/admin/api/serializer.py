from rest_framework import serializers
from .models import *

class UserSignupSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('name', 'email', 'password')
    
class UserSigninSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('email', 'password')     