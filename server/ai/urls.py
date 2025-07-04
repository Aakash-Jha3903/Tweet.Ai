from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('tweets-sentiment/<int:tweet_id>/', views.sentiment_analysis, name='sentiment-analysis'),
    path('tweet-summarize/', views.summarize_tweet, name='summarize_tweet')
    
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
