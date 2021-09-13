from django.urls import path, re_path

from . import views

app_name = 'story'
urlpatterns = [
    path('', views.all_tag_view.as_view()),
    path('add/', views..add_tag_view.as_view(), name='submit'),
    path('<id:tag_id>/', view.story_tag_view.as_view())
] 
