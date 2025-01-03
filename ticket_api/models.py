from django.db import models
import uuid
# Create your models here.

class Ticket(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False, null=False)
    status = models.CharField(max_length=100, default='open')
    issue = models.TextField()
    dateCreated = models.DateField(auto_now_add=True)
    close = models.DateField(null=True, default=None)

    user_fullName = models.CharField(max_length=200)
    user_email = models.CharField(max_length=150)
    user_contactNumber = models.CharField(max_length=30)

    def __str__(self):
        return f'{self.id} | {self.user_fullName} | {self.status}'

class Agent(models.Model):
    agent_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False, null=False)
    agent_fullName = models.CharField(max_length=100)
    agent_email = models.CharField(max_length=100)
    total_ticket = models.IntegerField(default=0)
    is_online = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.agent_fullName}'


class TicketAssigned(models.Model):
    assigned_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False, null=False)
    assigned_number = models.IntegerField(default=0)
    assigned_ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(Agent, on_delete=models.CASCADE)

    
    def __str__(self):
        return f'{self.assigned_id} | {self.assigned_to.agent_fullName} | {self.assigned_number}'
    