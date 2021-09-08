from django.urls import path, re_path

from . import views

app_name = 'story'
urlpatterns = [
    path('sort/<str:order>/', views.all_view.as_view(), name='story'),
    path('<int:story_id>/', views.story_view.as_view(), name='detail'),
    path('group/<str:obj>', views.group_return.as_view(), name='group'),
    path('comments/<int:story_id>/<int:comment_id>', views.comment_view.as_view(), name='comment'),
    #regex path 
    path('like/<str:obj>/<int:obj_id>/', views.like_view.as_view(), name='like'),
] 
