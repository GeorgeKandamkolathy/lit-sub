from django.urls import path

from . import views

app_name = 'story'
urlpatterns = [
    path('', views.all_view.as_view(), name='story'),
    path('<int:story_id>/', views.story_view.as_view(), name='detail'),
] 