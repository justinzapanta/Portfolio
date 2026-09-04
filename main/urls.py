from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('nfc/', views.nfcProfile, name='nfc'),
    path('api/', include('ticket_api.urls'))
]
