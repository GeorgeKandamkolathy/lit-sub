from django.urls import path

from . import views

app_name = 'user'
urlpatterns = [
    path('', views.all_view.as_view(), name='authors'),
    path('<int:author_id>/', views.author_view.as_view(), name='detail'),
    path('me/', views.my_account_view.as_view(), name='current'),
]