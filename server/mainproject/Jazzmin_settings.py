JAZZMIN_SETTINGS = {
    "site_title": "Tweet.AI🤖 Admin",
    "site_header": "Tweet.AI🤖 ",
    "site_brand": "Tweet.AI🤖",
    "welcome_sign": "Welcome to Tweet.AI🤖 Admin Panel",
    "copyright": "Tweet.AI🤖",
    "topmenu_links": [
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Docs", "url": "https://docs.djangoproject.com", "new_window": True},
    ],
    "usermenu_links": [
        {"name": "Profile", "url": "/profile", "new_window": False},
    ],
    "show_sidebar": True,            
    "show_ui_builder": True,        # Optional: Theme customizer

    "show_recent": False,
    
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "icons": {
        # ✅ Django built-ins
        "admin.LogEntry": "fas fa-clipboard-list",
        "auth.Permission": "fas fa-key",
        "auth.Group": "fas fa-users",
        "contenttypes.ContentType": "fas fa-database",
        "sessions.Session": "fas fa-clock",
        "authtoken.Token": "fas fa-user-lock",
        "authtoken.TokenProxy": "fas fa-user-shield",
        # ✅ My apps
        "notifications.Notification": "fas fa-bell",
        "tweets.Tweet": "fas fa-feather-alt",
        "tweets.Comment": "fas fa-comments",
        "chat.PrivateChat": "fas fa-envelope-open-text",
        "chat.Message": "fas fa-comment-dots",
        "users.User": "fas fa-user",
        "grok_ai.GrokChatRoom": "fas fa-comments",
        "grok_ai.GrokChatMessage": "fas fa-robot",
    },
    
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-dot-circle",
    "custom_css": None,
    "custom_js": None,
    "show_ui_builder": True,  # Allows real-time theme tweaking in admin
}


JAZZMIN_UI_TWEAKS = {
    "navbar": "navbar-dark bg-primary",
    "sidebar": "sidebar-dark-primary",
    "brand": "navbar-primary",
    
    "theme": "darkly",
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-outline-primary",
        "secondary": "btn-outline-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success"
    }
}
