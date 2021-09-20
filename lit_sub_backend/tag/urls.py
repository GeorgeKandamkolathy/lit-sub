from django.urls import path, re_path

from . import views

app_name = 'tag'
urlpatterns = [
    path('', views.all_tag_view.as_view(), name="tag"),
    path('create/', views.all_tag_view.as_view(), name="create"),
    path('add/<int:story_id>', views.add_tag_view.as_view(), name="add")
] 
