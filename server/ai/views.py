from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from tweets.models import Tweet, Comment
from collections import Counter

from textblob import TextBlob
from transformers import pipeline


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sentiment_analysis(request, tweet_id):
    tweet = get_object_or_404(Tweet, id=tweet_id)
    if tweet.author != request.user:
        return Response({'error': 'Not authorized'}, status=403)

    comments = Comment.objects.filter(post=tweet)
    results = []
    sentiment_counts = Counter()
    total_polarity = 0.0
    total_subjectivity = 0.0

    def get_sentiment_label(polarity):
        if polarity > 0.3:
            return "Positive"
        elif polarity < -0.3:
            return "Negative"
        else:
            return "Neutral"

    for comment in comments:
        blob = TextBlob(comment.body)
        polarity = round(blob.sentiment.polarity, 2)
        subjectivity = round(blob.sentiment.subjectivity, 2)
        sentiment = get_sentiment_label(polarity)

        sentiment_counts[sentiment] += 1
        total_polarity += polarity
        total_subjectivity += subjectivity

        results.append({
            'comment_id': comment.id,
            'body': comment.body,
            'polarity': polarity,
            'subjectivity': subjectivity,
            'sentiment': sentiment,
        })

    average_polarity = round(total_polarity / len(comments), 2) if comments else 0
    overall_sentiment = get_sentiment_label(average_polarity)

    suggestion = {
        "Positive": "Your tweet is receiving positive feedback! 😊",
        "Neutral": "Your tweet is getting mixed reactions. 😐",
        "Negative": "Most replies are critical. Consider revisiting the content. 😟"
    }.get(overall_sentiment, "Unable to determine sentiment.")

    return Response({
        'overall_sentiment': overall_sentiment,
        'average_polarity': average_polarity,
        'comment_counts': sentiment_counts,
        'suggestion': suggestion,
        'results': results
    })
    

summarizer = None

def get_summarizer():
    global summarizer
    if summarizer is None:
        summarizer = pipeline("summarization", model="t5-small")
    return summarizer

@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def summarize_tweet(request):
    tweet_text = request.data.get('text', '')

    if not tweet_text.strip():
        return Response({'error': 'No tweet text provided'}, status=400)
    if len(tweet_text)>1024:
        tweet_text = tweet_text[:1024]

    try:
        model = get_summarizer()
        summary = model(tweet_text, min_length=20,max_length=50, do_sample=False)
        return Response({'summary': summary[0]
                         ['summary_text'].capitalize() })
    except Exception as e:
        return Response({'error': str(e)}, status=500)
