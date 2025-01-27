from django.shortcuts import render
from rest_framework import generics
from .serializers import StateSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class getStates(generics.ListCreateAPIView):
    serializer_class = StateSerializer