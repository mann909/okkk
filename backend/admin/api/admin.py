from django.contrib import admin
from .models import *

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'intrest', 'phoneNumber')

class ChatGroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'createdOn')

class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'chatGroup', 'sender', 'message')    

admin.site.register(User, UserAdmin)
admin.site.register(ChatGroup, ChatGroupAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(File)