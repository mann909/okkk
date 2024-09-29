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
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from django.views import View
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

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
            user = User.objects.filter(email=payload.get('email')).first()
            files = File.objects.all()
            # all_file_data = [FileSerializer(i) for i in files]
            all_file_data=[]
            for i in files:
                ser = FileSerializer(i)
                all_file_data+=ser.data,
            

            recommended_files_data = []
            if user.ratingList or user.viewList:
                recommended_model_files = getRecommendedFiles(all_file_data, user.ratingList, user.viewList)
                recommended_file_ids=[]
                print("here")    
                for i in recommended_model_files:
                    recommended_file_ids.append(i['id'])
                    # Fetch File objects for recommended file IDs
            
                recommended_files = File.objects.filter(id__in=recommended_file_ids)
                recommended_files_data = FileSerializer(recommended_files, many=True).data

            # Serialize user data

            if user:
                # Return user data
                user_data = {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'ratingList' : user.ratingList,
                    'bookmarkList' : user.bookMarkList,
                    'chatList' : user.chatList
                }
                print(user_data)
                return Response({
                    'status': 200,
                    'user': user_data,
                    'allFiles': all_file_data,
                    'recommendedFiles': recommended_files_data,
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
 
class GetUserByIdView(APIView):
    permission_classes = [AllowAny]  # Ensure the user is authenticated

    def get(self, request, user_id, format=None):
        try:
            # Extract token from the Authorization header
            token = request.headers.get('Authorization', '')
            if not token:
                return Response({
                    'status': 401,
                    'message': 'No token provided'
                })

            user = User.objects.filter(id=user_id).first()

            if user:
                # Serialize the user object, not the user_id
                serializer = UserIdSerializer(user)
                return Response({
                    'status': 200,
                    'user': serializer.data
                })
            else:
                return Response({
                    'status': 404,
                    'message': 'User not found'
                })
        except Exception as e:
            return Response({
                'status': 500,
                '   message': 'Error while fetching user data',
                'error': str(e)
            })

class UserView(generics.ListAPIView):
    queryset = User.objects.all() 
    serializer_class = UserIdSerializer        

class UserFilesView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            # Get user_id from request data
            user_id = request.data.get('user_id')
            
            if not user_id:
                return Response({
                    'status': 400,
                    'message': 'User ID is required'
                })

            # Find the user by ID
            user = User.objects.filter(id=user_id).first()
            if not user:
                return Response({
                    'status': 404,
                    'message': 'User not found'
                })

            # Get all files uploaded by this user
            files = File.objects.filter(uploadedBy=user)
            
            # Serialize the files
            serializer = FileSerializer(files, many=True)
            
            return Response({
                'status': 200,
                'files': serializer.data
            })

        except Exception as e:
            return Response({
                'status': 500,
                'message': 'Error while fetching user files',
                'error': str(e)
            })

class SetGender(APIView):
    def post(self, request, format=None):
        try:
            # Extract token from the Authorization header
            token = request.headers.get('Authorization', '')
            if not token:
                return Response({
                    'status': 401,
                    'message': 'No token provided'
                })
            gender = request.data.get('gender')
            
            
            # Decode token to get user information
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = User.objects.filter(email=payload.get('email')).first()

            if gender != 'male' and gender != 'female':
                return Response({
                    'status' : 404,
                    'message' : 'Invalid gender'
                })
            
            
            user.gender = gender
            user.save()
            print(user.gender)
            return Response({
                'status' : 200,
                'message' : 'gender successfully updated'
            })

        except Exception as e:
            # Handle any other exceptions
            return Response({
                'status': 500,
                'message': 'Error while fetching doubt data',
                'error': str(e)
            })        
        
class CreateChatGroup(APIView):
    def post(self, request, format=None):
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
            requesting_user = User.objects.filter(email=payload.get('email')).first()
            if not requesting_user:
                return Response({
                    'status': 404,
                    'message': 'Requesting user not found'
                })

            # Extract the chat group name and ensure it's valid (e.g., "1_2")
            group_name = request.data.get('name')
            if not group_name or "_" not in group_name:
                return Response({
                    'status': 400,
                    'message': 'Invalid chat group name format'
                })

            # Split the group name to extract user IDs and sort them
            user1_id, user2_id = group_name.split("_")

            # Ensure both users exist
            user1 = User.objects.filter(id=user1_id).first()
            user2 = User.objects.filter(id=user2_id).first()
            if not user1 or not user2:
                return Response({
                    'status': 404,
                    'message': 'One or both users not found'
                })

            # Standardize the chat group name by always sorting user IDs (e.g., 1_2 and 2_1 become 1_2)
            sorted_group_name = "_".join(sorted([user1_id, user2_id]))

            # Check if the group already exists
            existing_group = ChatGroup.objects.filter(name=sorted_group_name).first()
            if existing_group:
                return Response({
                    'status': 400,
                    'message': 'Group already exists'
                })

            # Create new chat group
            serializer = CreateChatGroupSerializer(data={
                'name': sorted_group_name,  # Use the standardized name
            })

            if serializer.is_valid():
                chat_group = serializer.save()

                # Add the chat group ID to both users' chatList if not already added
                if not any(chat['chat_group_id'] == chat_group.id for chat in user1.chatList):
                    user1.chatList.append({'chat_group_id': chat_group.id})
                    user1.save()

                if not any(chat['chat_group_id'] == chat_group.id for chat in user2.chatList):
                    user2.chatList.append({'chat_group_id': chat_group.id})
                    user2.save()

                return Response({
                    'status': 200,
                    'message': 'Chat group successfully created',
                    'chatGroupId': chat_group.id  # Return the chat group ID as well
                })
            else:
                return Response({
                    'status': 400,
                    'errors': serializer.errors
                })

        except Exception as e:
            # Handle any other exceptions
            return Response({
                'status': 500,
                'message': 'Error occurred while creating chat group',
                'error': str(e)
            })
     
class GetChatroomsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Get the token from the request
            token = request.headers.get('Authorization', '').split(' ')[-1]
            
            # Decode the token to get the user's email
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_email = payload.get('email')
            
            # Get the user
            user = User.objects.get(email=user_email)
            
            # Get the chat_group_ids from the user's chatList
            chat_group_ids = [chat['chat_group_id'] for chat in user.chatList]
            
            # Get the chatrooms
            chatrooms = ChatGroup.objects.filter(id__in=chat_group_ids)
            
            # Serialize the chatrooms
            serializer = ChatGroupSerializer(chatrooms, many=True)
            
            print("Serialized data:", serializer.data)  # Debug print
            
            return Response({
                'status': 200,
                'chatrooms': serializer.data
            })
        except User.DoesNotExist:
            return Response({
                'status': 404,
                'message': 'User not found'
            })
        except jwt.ExpiredSignatureError:
            return Response({
                'status': 401,
                'message': 'Token has expired'
            })
        except jwt.DecodeError:
            return Response({
                'status': 401,
                'message': 'Invalid token'
            })
        except Exception as e:
            return Response({
                'status': 500,
                'message': 'Error fetching chatrooms',
                'error': str(e)
            })

class PostMessageView(APIView):
    def post(self, request, chat_name, format=None):
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
            user = User.objects.filter(email=payload.get('email')).first()
            
            chat_group = ChatGroup.objects.filter(name=chat_name).first()

            if not chat_group:
                return Response({
                    'stauts': 404,
                    'message': 'Chat group not found'
                })
            
            serializer = CreateMessageSerializer(data={
                'message' : request.data.get('message')
            })

            try:
                if serializer.is_valid():
                    serializer.save(chatGroup=chat_group, sender=user)
                    return Response({
                        'status': 200,
                        'message': 'The message is successfully posted.'
                    })
                else:
                    return Response({
                        'status': 400,
                        'errors': serializer.errors['error'][0]
                    })
            except Exception as e:
                return Response({
                    'status': 500,
                    'message': serializer.errors['error'][0]
                })    

        except Exception as e:
            # Handle any other exceptions
            return Response({
                'status': 500,
                'message': 'Error while fetching doubt data',
                'error': str(e)
            })       

class GetChatsView(APIView):

    def get(self, request, chat_name, format=None):
        try:
            # Extract token from the Authorization header
            token = request.headers.get('Authorization', '')
            if not token:
                return Response({
                    'status': 401,
                    'message': 'No token provided'
                })
            
            chat_group = ChatGroup.objects.filter(name=chat_name).first()

            if not chat_group:
                return Response({
                    'stauts': 404,
                    'message': 'Chat group not found'
                })
            
            serializer = GetChatsSerializer(chat_group)
            return Response({
                        'status': 200,
                        'chats': serializer.data
                    })

        except Exception as e:
            # Handle any other exceptions
            return Response({
                'status': 500,
                'message': 'Error while fetching doubt data',
                'error': str(e)
            })        
        
class PostFileView(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self,request):
        print(request.data)
        try:
            id = request.data.get('user_id')
            user = User.objects.filter(id=id).first()
            if not user:
                return Response({
                    'status': 404,
                    'message': 'User not found'
                    })
            else:
                serializer = PostFileSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save(uploadedBy=user)
                    return Response({
                        'status':200,
                        'message':'File uploaded successfully'
                    })
                else:
                    print(serializer.errors)
                    return Response({
                    'status': 401,
                    'message': 'Invalid Data Entered'
                    })
                    
        except Exception as e:
            print(e)
            return Response({
                'status':400,
                'message': "Some error occured wile uploading file",
                })

class GetFileView(APIView):

    def get(self, request, file_id, format=None):
        try:
            # Extract token from the Authorization header
            token = request.headers.get('Authorization', '')
            if not token:
                return Response({
                    'status': 401,
                    'message': 'No token provided'
                })
            
            file = File.objects.filter(id=file_id).first()

            if not file:
                return Response({
                    'stauts': 404,
                    'message': 'File not found'
                })
            
            serializer = FileSerializer(file)
            return Response({
                        'status': 200,
                        'file': serializer.data
                    })

        except Exception as e:
            # Handle any other exceptions
            return Response({
                'status': 500,
                'message': 'Error while fetching file data',
                'error': str(e)
            })       

class UpdateRatingView(APIView):
    permission_classes = [AllowAny]

    def put(self, request):
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
            user = User.objects.filter(email=payload.get('email')).first()
            if not user:
                return Response({
                    'status': 404,
                    'message': 'User not found'
                })

            # Extract request data
            prevRating = request.data.get("prevRating")
            newRating = request.data.get("newRating")
            file_id = request.data.get('id')

            # Fetch the file
            file = File.objects.filter(id=file_id).first()
            if not file:
                return Response({
                    'status': 404,
                    'message': 'File not found'
                })

            # Handle case where file.rating is None
            if file.rating is None:
                file.rating = 0

            # Update file rating
            file.rating = (file.rating - prevRating) + newRating
            file.save()

            # Fetch the uploadedBy user from the User model separately
            uploaded_by_user = User.objects.filter(id=file.uploadedBy.id).first()
            if not uploaded_by_user:
                return Response({
                    'status': 404,
                    'message': 'Uploader user not found'
                })

            # Handle case where uploadedBy user's ratings is None
            if uploaded_by_user.ratings is None:
                uploaded_by_user.ratings = 0

            # Update the uploader's ratings by subtracting prevRating and adding newRating
            uploaded_by_user.ratings = (uploaded_by_user.ratings - prevRating) + newRating
            uploaded_by_user.save()

            # Update requesting user's ratingList
            updated_rating = {'file_id': file_id, 'rating': newRating}

            # Check if the user has already rated the file
            found = False
            for rating_entry in user.ratingList:
                if rating_entry['file_id'] == file_id:
                    rating_entry['rating'] = newRating
                    found = True
                    break

            if not found:
                # Add new rating to ratingList if not already rated
                user.ratingList.append(updated_rating)

            user.save()

            return Response({
                'status': 200,
                'message': 'Rating successfully updated',
                'ratingList': user.ratingList
            })

        except Exception as e:
            # Handle any other exceptions
            return Response({
                'status': 500,
                'message': 'Error while updating rating',
                'error': str(e)
            })

class UpdateViewsView(APIView):
    permission_classes = [AllowAny]

    def put(self, request):
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
            user = User.objects.filter(email=payload.get('email')).first()
            if not user:
                return Response({
                    'status': 404,
                    'message': 'User not found'
                })

            # Extract request data
            file_id = request.data.get('id')

            # Fetch the file
            file = File.objects.filter(id=file_id).first()
            if not file:
                return Response({
                    'status': 404,
                    'message': 'File not found'
                })

            # Update file views
            file.views = (file.views or 0) + 1  # Increment views by 1
            file.save()

            # Update the uploader's views
            uploaded_by_user = User.objects.filter(id=file.uploadedBy.id).first()
            if not uploaded_by_user:
                return Response({
                    'status': 404,
                    'message': 'Uploader user not found'
                })

            uploaded_by_user.views = (uploaded_by_user.views or 0) + 1  # Increment uploader's views
            uploaded_by_user.save()

            # Update requesting user's viewList
            updated_view = {'file_id': file_id, 'views': file.views}

            # Check if the user has already viewed the file
            found = False
            for view_entry in user.viewList:
                if view_entry['file_id'] == file_id:
                    found = True
                    view_entry['views'] = view_entry['views'] + 1
                    break

            if not found:
                # Add new view entry if not already recorded
                user.viewList.append(updated_view)

            user.save()

            return Response({
                'status': 200,
                'message': 'Views successfully updated',
                'viewList': user.viewList
            })

        except Exception as e:
            # Handle any other exceptions
            return Response({
                'status': 500,
                'message': 'Error while updating views',
                'error': str(e)
            })
        
class UpdateBookmarkView(APIView):
    permission_classes = [AllowAny]

    def put(self, request):
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
            user = User.objects.filter(email=payload.get('email')).first()
            if not user:
                return Response({
                    'status': 404,
                    'message': 'User not found'
                })

            # Extract request data
            file_id = request.data.get('id')

            # Fetch the file
            file = File.objects.filter(id=file_id).first()
            if not file:
                return Response({
                    'status': 404,
                    'message': 'File not found'
                })

            # Check if the user has already bookmarked the file
            found = False
            for bookmark in user.bookMarkList:
                if bookmark['file_id'] == file_id:
                    found = True
                    break

            if not found:
                # Add new bookmark entry if not already recorded
                user.bookMarkList.append({'file_id': file_id})
            else:
                # Remove from bookMarkList if it exists
                user.bookMarkList = [bookmark for bookmark in user.bookMarkList if bookmark['file_id'] != file_id]

            # Save the user with updated bookmark list
            user.save()

            return Response({
                'status': 200,
                'message': 'Bookmark successfully updated',
                'bookMarkList': user.bookMarkList
            })

        except Exception as e:
            # Handle any other exceptions
            return Response({
                'status': 500,
                'message': 'Error while updating bookmark',
                'error': str(e)
            })
        
class GetAllBookmarkView(APIView):
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
            user = User.objects.filter(email=payload.get('email')).first()
            
            if user:
                # Retrieve the user's bookmark list
                bookmark_list = user.bookMarkList  # Assuming this is a list of dicts with 'file_id'
                
                # Extract file IDs from the bookmark list
                file_ids = [entry['file_id'] for entry in bookmark_list]
                
                # Filter files based on the extracted file IDs
                bookmarked_files = File.objects.filter(id__in=file_ids)
                
                # Serialize the bookmarked files
                serialized_files = FileSerializer(bookmarked_files, many=True).data

                return Response({
                    'status': 200,
                    'files': serialized_files,
                })
            else:
                return Response({
                    'status': 404,
                    'message': 'User not found'
                })
        except jwt.ExpiredSignatureError:
            return Response({
                'status': 401,
                'message': 'Token has expired'
            })
        except jwt.DecodeError:
            return Response({
                'status': 401,
                'message': 'Token is invalid'
            })
        except Exception as e:
            return Response({
                'status': 500,
                'message': 'Error while fetching user data',
                'error': str(e)
            })


def getRecommendedFiles(all_file_data, ratingList, viewList):
    # Convert data to DataFrames
    files_df = pd.DataFrame(all_file_data)
    views_df = pd.DataFrame([{"id": int(i['file_id']), "viewCount": int(i['views'])} for i in viewList])
    ratings_df = pd.DataFrame([{"id": int(i['file_id']), "rating": int(i['rating'])} for i in ratingList])

    # Merge DataFrames with explicit column naming
    df = files_df.merge(views_df, on='id', how='left', suffixes=('', '_view'))
    df = df.merge(ratings_df, on='id', how='left', suffixes=('', '_rating'))

    # Fill NaN values
    df['viewCount'].fillna(0, inplace=True)
    df['rating'].fillna(0, inplace=True)

    # Normalize viewCount and rating
    df['normalized_views'] = (df['viewCount'] - df['viewCount'].min()) / (df['viewCount'].max() - df['viewCount'].min() + 1e-8)
    df['normalized_rating'] = (df['rating'] - df['rating'].min()) / (df['rating'].max() - df['rating'].min() + 1e-8)

    # Calculate a combined score (you can adjust the weights)
    df['score'] = 0.6 * df['normalized_views'] + 0.4 * df['normalized_rating']

    # Sort by score to get top files
    top_files = df.nlargest(10, 'score')

    # Create a content string for each file
    df['content'] = df['name'] + ' ' + df['description'] + ' ' + df['category']
    top_files['content'] = top_files['name'] + ' ' + top_files['description'] + ' ' + top_files['category']

    # Combine content of top files
    top_content = ' '.join(top_files['content'])

    # Create TF-IDF vectorizer
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['content'])

    # Transform top_content
    top_content_vector = tfidf.transform([top_content])

    # Calculate cosine similarity
    cosine_sim = cosine_similarity(top_content_vector, tfidf_matrix)

    # Get similarity scores
    sim_scores = list(enumerate(cosine_sim[0]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the indices of the top 20 similar files (excluding exact matches)
    top_indices = [i[0] for i in sim_scores if i[1] < 1][:20]

    # Get the recommended files
    recommendations = df.iloc[top_indices]

    # Sort recommendations by score
    recommendations = recommendations.sort_values('score', ascending=False)

    # Convert recommendations to list of dictionaries
    recommendations_list = recommendations.to_dict(orient='records')

    return recommendations_list