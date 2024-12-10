from rest_framework import serializers
from .models import Ticket, Agent, TicketAssigned

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'


class TicketAssignedSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketAssigned
        fields = '__all__'


