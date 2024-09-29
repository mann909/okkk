from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id','name','email','ratings','uploads','views','gender', 'ratingList')

class UserIdSerializer(serializers.ModelSerializer):
    # doubts = DoubtSerializer(many=True, read_only=True)
    # solutions = SolutionSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id','name','email','ratings','uploads','views','gender', 'ratingList', 'chatList')        

class UserSignupSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('name', 'email', 'password')
    
class UserSigninSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('email', 'password')     

class CreateChatGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroup
        fields = ['name']        

class ChatGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatGroup
        fields = ['id', 'name']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    class Meta:
        model = Message
        fields = ['message', 'sender']        

class CreateMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    chatGroup = serializers.RelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ['message', 'sender', 'chatGroup']

class GetChatsSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatGroup
        fields = ['name', 'createdOn', 'messages']

class FileSerializer(serializers.ModelSerializer):
    uploadedBy = UserSerializer()  # Will serialize the user's name

    class Meta:
        model = File
        fields = (
            'id',
            'name',
            'type',
            'description',
            'file',
            'category',
            'uploadedBy',
            'uploadedAt',
            'rating',
            'views',
            'downloads'
        )

class PostFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ('id','name','type','description','category','file')        
               