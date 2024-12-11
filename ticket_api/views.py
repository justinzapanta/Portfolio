from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Q
from .serializers import TicketSerializer, AgentSerializer, TicketAssignedSerializer
from .models import Ticket, Agent, TicketAssigned
# Create your views here.

@api_view(['GET'])
def links(request):
    return Response({
        'Links' : {
            'GET/POST' : '/api/ticket',
            'PUT' : '/api/ticket/{id}',
            'DELETE' : '/api/ticket/{id}',

            'GET/POST' : '/api/agent',
        },
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
        try:
            ticket = Ticket.objects.filter(filters)
            serialize = TicketSerializer(ticket, many=True)
            return Response({"results" : serialize.data})
        except:
            return Response({"results" : '[]'})
            
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

                return Response({"result" : modify_data})
            except:
                return Response({"result" : 'Agents are not available'})
    return Response({"result" : 'Something Wrong'})


@api_view(['PUT', 'DELETE'])
def update_ticket(request, id):
    if request.method == 'PUT':
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
            ticket.save()
            
            update = TicketSerializer(ticket, many=False)

            return Response({"result" : update.data})
        except:
            return Response({"result" : 'Something Wrong'})
    else:
        try:
            ticket = Ticket.objects.get(id = id)
            ticket.delete()
            return Response({"result" : 'Deleted Successfully'})
        except:
            return Response({"result" : 'Ensure the ID is correct'})
        


@api_view(['GET', 'POST'])
def agent(request):
    if request.method == 'GET':
        params = request.query_params
        filters = Q()

        if params.get('agent_id'):
            filters &= Q(agent_id = params['agent_id'])

        if params.get('agent_fullName'):
            filters &= Q(agent_fullName__icontains = params['agent_fullName'])

        if params.get('agent_email'):
            filters &= Q(agent_email = params['agent_email'])

        if params.get('total_ticket'):
            filters &= Q(total_ticket = params['total_ticket'])

        if params.get('is_online'):
            filters &= Q(is_online = params['is_online'])

        
        agents = Agent.objects.filter(filters)
        serialize = AgentSerializer(agents, many=True)

        return Response({'results' : serialize.data})
    elif request.method == 'POST':
        new_agent = AgentSerializer(data=request.data)

        if new_agent.is_valid():
            new_agent.save()

            return Response({'result' : new_agent.data})
        return Response({'result' : 'Something Wrong'})
    return Response({'results' : 'Something Wrong'})


@api_view(['PUT', 'DELETE'])
def update_agent(request, id):
    if request.method == 'PUT':
        # try:
        agent = Agent.objects.get(agent_id = id)
        body = request.data

        if body.get('agent_fullName'):
            agent.agent_fullName = body['agent_fullName']

        if body.get('agent_email'):
            agent.agent_email = body['agent_email']
        agent.save()

        serialize = AgentSerializer(agent, many=False)
        return Response({'result' : serialize.data})
        # except:
        #     return Response({'result' : 'Ensure the ID is correct'})
    elif request.method == 'DELETE':
        try:
            agent = Agent.objects.get(agent_id = id)
            agent.delete()
            return Response({"result" : 'Deleted Successfully'})
        except:
             return Response({'result' : 'Ensure the ID is correct'})


@api_view(['GET'])
def ticket_assigned(request):
    try:
        params = request.query_params
        filter = Q()
        if params.get('assigned_id'):
            filter &= Q(assigned_id = params['assigned_id'])
            
        if params.get('assigned_number'):
            filter &= Q(assigned_id = params['assigned_number'])

        if params.get('user_id'):
            filter &= Q(assigned_ticket__id = params['user_id'])

        if params.get('user_fullName'):
            filter &= Q(assigned_ticket__user_fullName = params['user_fullName'])

        if params.get('user_email'):
            filter &= Q(assigned_ticket__user_email = params['user_email'])
            
        if params.get('agent_id'):
            filter &= Q(assigned_to__agent_id = params['agent_id'])

        if params.get('agent_fullName'):
            filter &= Q(assigned_to__agent_fullName = params['agent_fullName'])

        if params.get('agent_email'):
            filter &= Q(assigned_to__agent_email = params['agent_email'])

        assigned = TicketAssigned.objects.filter(filter)
        serialize = TicketAssignedSerializer(assigned, many=True)
        return Response({'results' : serialize.data})
    except:
        return Response({'results' : 'Something Wrong'})