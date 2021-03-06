from django.urls import path, re_path

from . import views

app_name = 'story'
urlpatterns = [
    path('submit/', views.submit_view.as_view(), name='submit'),
    path('tag/<str:tag>/', views.tag_return_view.as_view(), name='tag'),
    path('sort/<str:order>/', views.all_view.as_view(), name='sort'),
    path('<int:story_id>/', views.story_view.as_view(), name='detail'),
    path('group/<str:obj>', views.group_return.as_view(), name='group'),
    path('comments/<int:story_id>/<int:comment_id>', views.comment_view.as_view(), name='comment'),
    #regex path 
    path('like/<str:obj>/<int:obj_id>/', views.like_view.as_view(), name='like'),
] 
