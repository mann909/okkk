from django.contrib import admin
from .models import *

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'intrest', 'phoneNumber')

class ChatGroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'createdOn')

class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'chatGroup', 'sender', 'message')

class FileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'uploadedBy', 'category', 'rating', 'views', 'downloads', 'uploadedAt')
    search_fields = ('name', 'uploadedBy__name', 'category')
    list_filter = ('category', 'uploadedAt')

# Register models and their admin classes
admin.site.register(User, UserAdmin)
admin.site.register(ChatGroup, ChatGroupAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(File, FileAdmin)
