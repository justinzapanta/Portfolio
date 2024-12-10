from django.urls import path
from . import views

urlpatterns = [
    path('', views.links),
    path('ticket', views.ticket),
    path('ticket/<str:id>', views.update_ticket)
]