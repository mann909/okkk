from rest_framework.views import APIView
from rest_framework import generics,status
from rest_framework.response import Response
from .models import *
from .serializer import *
import jwt
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.hashers import make_password,check_password
from rest_framework.permissions import AllowAny
from django.conf import settings

# Create your views here.
class UserSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        try:
            # Get name, email, and password from request data
            name = request.data.get('name')
            email = request.data.get('email')
            password = request.data.get('password')

            # Email validation
            if not email or not self.validate_email(email):
                return Response({
                    'status': 406,
                    'message': 'Invalid email format'
                })

            # Check if user already exists
            user = User.objects.filter(email=email).first()
            if user:
                return Response({
                    'status': 400,
                    'message': 'Account Already exists, Please SignIn'
                })

            # Password validation
            if not password or not self.validate_password(password):
                return Response({
                    'status': 406,
                    'message': 'Password must be at least 8 characters long and contain at least one number and one special character'
                })

            # Create a new user
            user = User.objects.create(
                name=name,
                email=email,
                password=make_password(password)  # Hash the password before saving
            )
            user.save()

            # Generate JWT token
            jwt_token = self.create_jwt(email)
            return Response({
                'status': 200,
                'jwt': jwt_token,
                'name': name,
                'email': email,
            })
        except Exception as e:
            return Response({
                'status': 500,
                'message': 'Error while creating user',
                'error': str(e)
            })

    def validate_email(self, email):
        """Validate the format of the email."""
        import re
        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        return re.match(email_regex, email)

    def validate_password(self, password):
        """Validate password strength."""
        import re
        if len(password) < 8:
            return False
        if not re.search(r'\d', password):  # Ensure there is at least one digit
            return False
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):  # Ensure one special character
            return False
        return True

    def create_jwt(self, email):
        payload = {
            'email': email,
            'exp': timezone.now() + timedelta(hours=1),  # Token expires in 1 hour
            'iat': timezone.now()  # Issued at time
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return token



class UserSigninView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        try:
            # Get email and password from request data
            email = request.data.get('email')
            password = request.data.get('password')

            # Email validation
            if not email or not self.validate_email(email):
                return Response({
                    'status': 406,
                    'message': 'Invalid email format'
                })

            user = User.objects.filter(email=email).first()
            if user:
                # Password validation
                if not password or not self.validate_password(password):
                    return Response({
                        'status': 406,
                        'message': 'Password must be at least 8 characters long and contain at least one number and one special character'
                    })

                if not check_password(password, user.password):
                    return Response({
                        'status': 401,
                        'message': 'Incorrect Password'
                    })
                else:
                    jwt_token = self.create_jwt(email)
                    return Response({
                        'status': 201,
                        'jwt': jwt_token,
                        'name': user.name,
                        'email': user.email,
                    })
            else:
                return Response({
                    'status': 404,
                    'message': 'User does not exist, Please SignUp'
                })
        except Exception as e:
            return Response({
                'status': 500,
                'message': 'You are not Registered yet',
                'error': str(e)
            })

    def validate_email(self, email):
        """Validate the format of the email."""
        import re
        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        return re.match(email_regex, email)

    def validate_password(self, password):
        """Validate password strength."""
        import re
        if len(password) < 8:
            return False
        if not re.search(r'\d', password):  # Ensure there is at least one digit
            return False
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):  # Ensure one special character
            return False
        return True

    def create_jwt(self, email):
        payload = {
            'email': email,
            'exp': timezone.now() + timedelta(hours=1),  # Token expires in 1 hour
            'iat': timezone.now()  # Issued at time
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return token


    
class GetUserView(APIView):
    
    permission_classes = [AllowAny]  # Ensure the user is authenticated

    def get(self, request, format=None):
        try:
            # Extract token from the Authorization header
            token = request.headers.get('Authorization', '')
            if not token:
                return Response({
                    'status': 401,
                    'message': 'No token provided'
                })

            # Decode token to get user information
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            print(payload)
            print(payload.get('email'))
            user = User.objects.filter(email=payload.get('email')).first()

            if user:
                # Return user data
                user_data = {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email
                }
                print(user_data)
                return Response({
                    'status': 200,
                    'user': user_data
                })
            else:
                return Response({
                    'status': 404,
                    'message': 'User not found'
                })
        except Exception as e:
            return Response({
                'status': 500,
                'message': 'Error while fetching user data',
                'error': str(e)
            })    