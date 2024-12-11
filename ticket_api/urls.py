from django.urls import path
from . import views

urlpatterns = [
    path('', views.links),
    path('ticket/assigned', views.ticket_assigned),
    path('ticket', views.ticket),
    path('ticket/<str:id>', views.update_ticket),
    path('agent', views.agent),
    path('agent/<str:id>', views.update_agent),

    path('email', views.send_email)
]