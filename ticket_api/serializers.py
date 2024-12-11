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



class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = '__all__'