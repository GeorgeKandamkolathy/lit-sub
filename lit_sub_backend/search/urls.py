from django.urls import path, re_path

from . import views

app_name = 'search'
urlpatterns = [
    path('', views.empty_search_view.as_view(), name='empty'),
    path('<str:search_str>', views.search_view.as_view(), name='search'),
] 
