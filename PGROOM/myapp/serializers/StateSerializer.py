from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import State

# Separate validation function for 'id'
def validateState(data):
    if 'id' not in data:
        raise ValidationError({"id": "The 'id' field is required."})

    if not State.objects.filter(id=data['id']).exists():
        raise ValidationError({"id": "State with this ID does not exist."})
