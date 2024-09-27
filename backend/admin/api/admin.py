from django.contrib import admin
from .models import *

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'intrest', 'phoneNumber')

admin.site.register(User, UserAdmin)