from django.urls import path, re_path

from . import views

app_name = 'story'
urlpatterns = [
    path('', views.all_view.as_view(), name='story'),
    path('<int:story_id>/', views.story_view.as_view(), name='detail'),
    path('comments/<int:story_id>/<int:comment_id>', views.comment_view.as_view(), name='comment'),
    path('like/<str:obj>/<int:obj_id>', views.like_view.as_view(), name='like'),
] 
