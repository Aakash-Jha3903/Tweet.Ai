from rest_framework import permissions

class IsUserOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS: #('GET', 'HEAD', 'OPTIONS')
            return True
        return obj == request.user

        