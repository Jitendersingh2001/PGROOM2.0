from django.db import models

class State(models.Model):
    state_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'state'  # Camel case for the table name

    def __str__(self):
        return self.state_name


class City(models.Model):
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='cities')
    city_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'city'  # Camel case for the table name

    def __str__(self):
        return self.city_name


class User(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'Active'
        DELETED = 'Deleted'
        INVITED = 'Invited'

    class Roles(models.TextChoices):
        SUPERADMIN = 'SuperAdmin'
        ADMIN = 'Admin'
        TENANT = 'Tenant'
    
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    mobile_no = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.ACTIVE)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user'  # Camel case for the table name

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class UserRole(models.Model):
    class Roles(models.TextChoices):
        SUPERADMIN = 'SuperAdmin'
        ADMIN = 'Admin'
        TENANT = 'Tenant'

    role = models.CharField(max_length=50, choices=Roles.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'userRole'  # Camel case for the table name

    def __str__(self):
        return self.role


class UserRoleLink(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='role_links')
    role = models.ForeignKey(UserRole, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'userRoleLink'  # Camel case for the table name


class UserProperties(models.Model):
    class PropertyStatus(models.TextChoices):
        ACTIVE = 'Active'
        INACTIVE = 'Inactive'
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    property_name = models.CharField(max_length=255)
    property_image = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=PropertyStatus.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'userProperties'  # Camel case for the table name


class Rooms(models.Model):
    class RoomStatus(models.TextChoices):
        AVAILABLE = 'Available'
        OCCUPIED = 'Occupied'

    property = models.ForeignKey(UserProperties, on_delete=models.CASCADE, related_name='rooms')
    room_no = models.IntegerField()
    room_image = models.CharField(max_length=255)  # S3 bucket link
    status = models.CharField(max_length=50, choices=RoomStatus.choices)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'rooms'  # Camel case for the table name


class Tenant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    property = models.ForeignKey(UserProperties, on_delete=models.CASCADE)
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tenant'  # Camel case for the table name


class Rent(models.Model):
    class PaymentMethod(models.TextChoices):
        CASH = 'Cash'
        UPI = 'UPI'
    
    class RentStatus(models.TextChoices):
        PAID = 'Paid'
        UNPAID = 'Unpaid'
    
    amount = models.IntegerField()
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50, choices=PaymentMethod.choices)
    upi_id = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=50, choices=RentStatus.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'rent'  # Camel case for the table name


class ElectricityBill(models.Model):
    class BillStatus(models.TextChoices):
        PAID = 'Paid'
        UNPAID = 'Unpaid'
    
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE)
    amount = models.IntegerField()
    payment_method = models.CharField(max_length=50, choices=Rent.PaymentMethod.choices)
    upi_id = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=50, choices=BillStatus.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'electricityBill'  # Camel case for the table name
