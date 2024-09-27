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
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Email validation
                email = serializer.validated_data.get('email')
                if not self.validate_email(email):
                    return Response({
                        'status': 406,
                        'message': 'Invalid email format'
                    })

                user = User.objects.filter(email=email).first()
                if user:
                    return Response({
                        'status': 400,
                        'message': 'Account Already exists, Please SignIn'
                    })
                else:
                    password = serializer.validated_data.get('password')

                    # Password validation
                    if not self.validate_password(password):
                        return Response({
                            'status': 406,
                            'message': 'Password must be at least 8 characters long and contain at least one number and one special character'
                        })
                    serializer.save()
                    jwt_token = self.create_jwt(email)
                    return Response({
                        'status': 200,
                        'jwt': jwt_token,
                        'name': serializer.validated_data.get("name"),
                        'email': email,
                    })
            except Exception as e:
                return Response({
                    'status': 500,
                    'message': 'Error while creating user',
                    'error': str(e)
                })
        else:
            return Response({
                'status': 406,
                'message': "serializer.errors['password'][0]"
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
        serializer = UserSigninSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Email validation
                email = serializer.validated_data.get('email')
                if not self.validate_email(email):
                    return Response({
                        'status': 406,
                        'message': 'Invalid email format'
                    })

                user = User.objects.filter(email=email).first()
                if user:
                    password = serializer.validated_data.get('password')

                    # Password validation
                    if not self.validate_password(password):
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
        else:
            return Response({
                'status': 406,
                'message': serializer.errors['password'][0]
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