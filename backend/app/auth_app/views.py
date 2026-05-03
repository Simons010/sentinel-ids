from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from app.users.models import UserProfile


def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access":  str(refresh.access_token),
        "refresh": str(refresh),
    }


def user_data(user):
    profile = getattr(user, "profile", None)
    return {
        "id":          user.id,
        "username":    user.username,
        "email":       user.email,
        "first_name":  user.first_name,
        "last_name":   user.last_name,
        "role":        profile.role        if profile else "viewer",
        "is_approved": profile.is_approved if profile else False,
        "initials":    (
            (user.first_name[0] + user.last_name[0]).upper()
            if user.first_name and user.last_name
            else user.username[:2].upper()
        ),
    }


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username   = request.data.get("username", "").strip()
        email      = request.data.get("email", "").strip()
        password   = request.data.get("password", "")
        first_name = request.data.get("first_name", "").strip()
        last_name  = request.data.get("last_name", "").strip()

        if not username or not email or not password:
            return Response(
                {"error": "Username, email and password are required"},
                status=400
            )

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=400)

        if len(password) < 8:
            return Response(
                {"error": "Password must be at least 8 characters"},
                status=400
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        UserProfile.objects.create(
            user=user,
            role="viewer",          # default role
            is_approved=False,      # requires admin approval
        )

        return Response({
            "message": "Account created. Awaiting admin approval before you can log in.",
            "username": username,
        }, status=201)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=400
            )

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=401)

        if not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=401)

        if not user.is_active:
            return Response({"error": "Account is disabled"}, status=403)

        profile = getattr(user, "profile", None)
        if profile and not profile.is_approved and not user.is_superuser:
            return Response({
                "error": "Your account is pending admin approval. You will be notified once approved."
            }, status=403)

        tokens = get_tokens(user)
        return Response({
            **tokens,
            "user": user_data(user),
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=400)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"})
        except TokenError:
            return Response({"error": "Invalid or expired token"}, status=400)


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=400)
        try:
            token = RefreshToken(refresh_token)
            return Response({
                "access":  str(token.access_token),
                "refresh": str(token),
            })
        except TokenError:
            return Response({"error": "Token expired or invalid"}, status=401)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(user_data(request.user))


class ApproveUserView(APIView):
    """Admin-only — approve a pending user."""
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if not request.user.is_superuser:
            profile = getattr(request.user, "profile", None)
            if not profile or profile.role != "admin":
                return Response({"error": "Admin access required"}, status=403)

        try:
            target = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        profile, _ = UserProfile.objects.get_or_create(user=target)
        profile.is_approved = True
        profile.approved_by = request.user
        profile.approved_at = timezone.now()
        profile.save()

        return Response({"message": f"{target.username} approved successfully"})


class PendingUsersView(APIView):
    """Admin-only — list users awaiting approval."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            profile = getattr(request.user, "profile", None)
            if not profile or profile.role != "admin":
                return Response({"error": "Admin access required"}, status=403)

        pending = UserProfile.objects.filter(
            is_approved=False
        ).select_related("user")

        return Response([
            {
                "id":         p.user.id,
                "username":   p.user.username,
                "email":      p.user.email,
                "first_name": p.user.first_name,
                "last_name":  p.user.last_name,
                "role":       p.role,
                "date_joined": p.user.date_joined,
            }
            for p in pending
        ])