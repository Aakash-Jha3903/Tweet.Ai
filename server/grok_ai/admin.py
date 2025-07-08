from django.contrib import admin
from .models import GrokChatRoom, GrokChatMessage

# Inline to show messages within the chat room
class GrokChatMessageInline(admin.TabularInline):
    model = GrokChatMessage
    extra = 0
    readonly_fields = ('sender', 'message', 'timestamp')
    can_delete = False
    show_change_link = True

@admin.register(GrokChatRoom)
class GrokChatRoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at', 'message_count')
    search_fields = ('name', 'user__username')
    list_filter = ('created_at',)
    inlines = [GrokChatMessageInline]
    readonly_fields = ('created_at',)

    def message_count(self, obj):
        return obj.messages.count()
    message_count.short_description = "Message Count"

@admin.register(GrokChatMessage)
class GrokChatMessageAdmin(admin.ModelAdmin):
    list_display = ('short_message', 'room', 'sender', 'timestamp')
    search_fields = ('message', 'room__name', 'room__user__username')
    list_filter = ('sender', 'timestamp')
    date_hierarchy = 'timestamp'
    readonly_fields = ('timestamp',)

    def short_message(self, obj):
        return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message
    short_message.short_description = "Message Preview"
