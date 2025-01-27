from django.contrib.auth.models import State
from rest_framework import serializers

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ["id"]

    def find(self, validated_data):
        # Check if 'id' is present in validated data
        if 'id' not in validated_data:
            raise serializers.ValidationError({"id": "This field is required."})
        # If 'id' is present, retrieve the State object
        return State.objects.get(id=validated_data["id"])
