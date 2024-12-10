from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Q
from .serializers import TicketSerializer
from .models import Ticket, Agent, TicketAssigned
# Create your views here.

@api_view(['GET'])
def links(request):
    return Response({
        'Links' : {
            'GET/POST' : '/api/ticket',
            'PUT' : '/api/ticket/{id}'
        },
        'params' : {
            '/api/ticket' : 'ticket_number, ticket_id, ticket_issue'
        }
    })


@api_view(['GET', 'POST'])
def ticket(request):
    params = request.query_params

    if request.method == 'GET':
        filters = Q()
        params = request.query_params

        if params.get('id'):
            filters &= Q(id = params['id'])

        if params.get('status'):
            filters &= Q(status = params['status'])

        if params.get('issue'):
            filters &= Q(issue__icontains = params['issue'])
        
        if params.get('dateCreated'):
            filters &= Q(dateCreated = params['dateCreated'])

        if params.get('close'):
            filters &= Q(close = params['close'])

        if params.get('user_fullName'):
            filters &= Q(user_fullName = params['user_fullName'])

        if params.get('user_email'):
            filters &= Q(user_email = params['user_email'])

        if params.get('user_contactNumber'):
            filters &= Q(user_contactNumber = params['user_contactNumber'])

        ticket = Ticket.objects.filter(filters)
        serialize = TicketSerializer(ticket, many=True)
        
        return Response({"results" : serialize.data})
    
    elif request.method == 'POST':
        new_ticket = TicketSerializer(data=request.data)

        if new_ticket.is_valid():
            try:
                new_ticket.save()

                #assign ticket to the agents
                registered = Ticket.objects.get(id = new_ticket.data['id'])
                first_agent = Agent.objects.filter(is_online = True)
                
                agent = Agent.objects.filter(total_ticket__lt = first_agent[0].total_ticket, is_online = True)
                asign_ticket = ''
                if agent:
                    selected_agent = agent[0]
                    selected_agent.total_ticket = selected_agent.total_ticket + 1
                    selected_agent.save()
                    
                    print(selected_agent.total_ticket)
                    asign_ticket = TicketAssigned(
                        assigned_ticket = registered,
                        assigned_to = selected_agent,
                        assigned_number = selected_agent.total_ticket
                    )
                    asign_ticket.save()
                else:
                    first_agent = first_agent[0]
                    first_agent.total_ticket = first_agent.total_ticket + 1
                    first_agent.save()

                    asign_ticket = TicketAssigned(
                        assigned_ticket = registered,
                        assigned_to = first_agent,
                        assigned_number = first_agent.total_ticket
                    )
                    asign_ticket.save()
                
                modify_data = new_ticket.data
                modify_data['is_assigned_to_agent'] = {
                    'agent_id' : asign_ticket.assigned_to.agent_fullName,
                    'agent_email' : asign_ticket.assigned_to.agent_email,
                    'total_ticket' : asign_ticket.assigned_to.total_ticket,
                    'is_online' : asign_ticket.assigned_to.is_online,
                }

                return Response({"New ticket" : modify_data})
            except:
                return Response({"New ticket" : 'Agents are not available'})
    return Response({"New ticket" : 'Something Wrong'})


@api_view(['PUT'])
def update_ticket(request, id):
    try:
        ticket = Ticket.objects.get(id = id)
        data = request.data

        if data.get('id'):
            ticket.id = data['id']

        if data.get('status'):
            ticket.status = data['status']

        if data.get('issue'):
            ticket.issue = data['issue']
        
        if data.get('dateCreated'):
            ticket.dateCreated = data['dateCreated']

        if data.get('close'):
            ticket.close = data['close']

        if data.get('user_fullName'):
            ticket.user_fullName = data['user_fullName']

        if data.get('user_email'):
            ticket.user_email = data['user_email']

        if data.get('user_contactNumber'):
            ticket.user_contactNumber = data['user_contactNumber']
        
        update = TicketSerializer(ticket, many=False)

        return Response({"Updated" : update.data})
    except:
        return Response({"message" : 'Something Wrong'})


