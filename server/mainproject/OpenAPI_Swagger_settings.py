
SPECTACULAR_SETTINGS = {
    'TITLE': '🎯 Tweet.AI 🤖 — Backend APIs',
    'DESCRIPTION': """
### 🚀 Welcome to the Tweet.AI Backend API Docs

Tweet.AI is an AI-powered Twitter-like platform built with React.js + Python-Django, DRF, and many more technologies.  
These APIs allow you to:

- 🔍 Analyze sentiment on tweets  
- ✨ Summarize tweet content  
- 💬 Manage real-time chat rooms  
- 👥 Handle followers & user profiles  
- 🔔 View & mark notifications
- ❤️ Like, retweet, and reply to tweets  
- 📈 Nested Comments on tweets
- 📊 Explore advanced AI features like Grok AI
- 🛠️ And much more!


_Use the endpoints below to explore all the available actions._  
""",
    'VERSION': '1.0.0',
    'CONTACT': {
        'name': 'Aakash Jha',
        'email': 'aakashjha343@gmail.com',
        'url': 'https://www.linkedin.com/in/aakash-jha-a11931257/',
    },
    'SCHEMA_PATH_PREFIX_TRIM': True,
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    "SHOW_ERRORS": False,  # 👈 This disables logging of schema generation errors   
    'SERVE_PERMISSIONS': ['rest_framework.permissions.AllowAny'],
    'SERVE_AUTHENTICATION': [],
    'SWAGGER_UI_SETTINGS': {
        'docExpansion': 'none',
        'defaultModelRendering': 'model',
        'deepLinking': True,
        'displayRequestDuration': True,
        'filter': True,
        'showExtensions': True,
        'persistAuthorization': True,
        'syntaxHighlight': {
            'activated': True,
        },
        'theme': 'dark',  # Optional: change theme
    },
    'PREPROCESSING_HOOKS': [],
    'POSTPROCESSING_HOOKS': [],
}
    
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {
        "require_debug_false": {
            "()": "django.utils.log.RequireDebugFalse",
        },
    },
    "handlers": {
        "console": {
            "level": "INFO",  # 👈 Change from "DEBUG" to "INFO" to suppress verbose logs
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",  # 👈 This keeps only important logs
        },
        "drf_spectacular": {
            "handlers": ["console"],
            "level": "ERROR",  # 👈 Prevents those warning/error logs
            "propagate": False,
        },
    },
}