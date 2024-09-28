from django.db import models
from datetime import datetime

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    phoneNumber = models.CharField(max_length=100, null=True)
    intrest = models.CharField(max_length=100, null=True)

class ChatGroup(models.Model):
    name = models.CharField(max_length=100, unique=True)
    createdOn = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return self.name


class Message(models.Model):
    chatGroup = models.ForeignKey(ChatGroup, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    message = models.CharField(max_length=1000)