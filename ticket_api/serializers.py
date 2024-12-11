from rest_framework import serializers
from .models import Ticket, Agent, TicketAssigned

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'


class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = '__all__'


class TicketAssignedSerializer(serializers.ModelSerializer):
    assigned_ticket = TicketSerializer()
    assigned_to = AgentSerializer()

    class Meta:
        model = TicketAssigned
        fields = ['assigned_id', 'assigned_number', 'assigned_ticket', 'assigned_to']