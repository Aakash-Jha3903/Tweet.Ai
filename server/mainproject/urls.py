from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # ✅ Swagger/OpenAPI Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),                        # Raw Schema JSON
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'), # Swagger UI
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),       # ReDoc

    # 🔁 Project existing routes
    path('', include('users.urls')),
    path('auth/', include('djoser.urls')),
    path('auth/',  include('djoser.urls.jwt')), 
    path('tweets/', include('tweets.urls')),
    path('notify/', include('notifications.urls')),
    path('ai/', include('ai.urls')),
    path('chats/', include('chat.urls')),
    path('grok-ai/', include('grok_ai.urls')),
]


urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

