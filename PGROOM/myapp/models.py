from django.db import models

class State(models.Model):
    stateName = models.CharField(max_length=255)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'state' 

    def __str__(self):
        return self.stateName


class City(models.Model):
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='stateCities', db_column='stateId')
    cityName = models.CharField(max_length=255)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'city' 

    def __str__(self):
        return self.cityName


class User(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'Active'
        DELETED = 'Deleted'
        INVITED = 'Invited'

    class Roles(models.TextChoices):
        SUPERADMIN = 'SuperAdmin'
        ADMIN = 'Admin'
        TENANT = 'Tenant'
    
    firstName = models.CharField(max_length=255)
    lastName = models.CharField(max_length=255)
    mobileNo = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    state = models.ForeignKey(State, on_delete=models.CASCADE, db_column='stateId')
    city = models.ForeignKey(City, on_delete=models.CASCADE, db_column='cityId')
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.ACTIVE)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user'

    def __str__(self):
        return f"{self.firstName} {self.lastName}"


class UserRole(models.Model):
    class Roles(models.TextChoices):
        SUPERADMIN = 'SuperAdmin'
        ADMIN = 'Admin'
        TENANT = 'Tenant'

    role = models.CharField(max_length=50, choices=Roles.choices)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'userRole'

    def __str__(self):
        return self.role


class UserRoleLink(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userRoleLinks', db_column='userId')
    role = models.ForeignKey(UserRole, on_delete=models.CASCADE, related_name='userRoleLinks', db_column='roleId')
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'userRoleLink'


class UserProperties(models.Model):
    class PropertyStatus(models.TextChoices):
        ACTIVE = 'Active'
        INACTIVE = 'Inactive'
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userProperties', db_column='userId')
    state = models.ForeignKey(State, on_delete=models.CASCADE, db_column='stateId')
    city = models.ForeignKey(City, on_delete=models.CASCADE, db_column='cityId')
    propertyName = models.CharField(max_length=255)
    propertyImage = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=PropertyStatus.choices)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'userProperties'


class Rooms(models.Model):
    class RoomStatus(models.TextChoices):
        AVAILABLE = 'Available'
        OCCUPIED = 'Occupied'

    property = models.ForeignKey(UserProperties, on_delete=models.CASCADE, related_name='propertyRooms', db_column='userPropertiesId')
    roomNo = models.IntegerField()
    roomImage = models.CharField(max_length=255)  # S3 bucket link
    status = models.CharField(max_length=50, choices=RoomStatus.choices)
    description = models.CharField(max_length=255)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'rooms'


class Tenant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tenantUsers', db_column='userId')
    property = models.ForeignKey(UserProperties, on_delete=models.CASCADE, related_name='tenantProperties', db_column='userPropertiesId')
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE, related_name='tenantRooms', db_column='roomId')
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tenant'


class Rent(models.Model):
    class PaymentMethod(models.TextChoices):
        CASH = 'Cash'
        UPI = 'UPI'
    
    class RentStatus(models.TextChoices):
        PAID = 'Paid'
        UNPAID = 'Unpaid'
    
    amount = models.IntegerField()
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE, related_name='rentRooms', db_column='roomId')
    payment_method = models.CharField(max_length=50, choices=PaymentMethod.choices)
    upiId = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=50, choices=RentStatus.choices)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'rent'


class ElectricityBill(models.Model):
    class BillStatus(models.TextChoices):
        PAID = 'Paid'
        UNPAID = 'Unpaid'
    
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE, related_name='electricityBills', db_column='roomId')
    amount = models.IntegerField()
    payment_method = models.CharField(max_length=50, choices=Rent.PaymentMethod.choices)
    upiId = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=50, choices=BillStatus.choices)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'electricityBill'
