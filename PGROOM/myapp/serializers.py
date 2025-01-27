from rest_framework import serializers
from django.contrib.auth.models import State
from myapp.validator import validateState

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ["id"]

    def validate(self, data):
        validateState(data)
        return data

    def find(self, validated_data):
        return State.objects.get(id=validated_data["id"])
