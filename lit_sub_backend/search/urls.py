from django.urls import path, re_path

from . import views

app_name = 'search'
urlpatterns = [
    path('<str:search_str>', views.search_view.as_view(), name='search'),
] 
