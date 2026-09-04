from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'main/views/index.html')

def nfcProfile(request):
    return render(request, 'main/views/nfc.html')
