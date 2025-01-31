# Generated by Django 5.1.5 on 2025-01-27 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_auto_20250125_1819'),
    ]

    operations = [
        migrations.RenameField(
            model_name='city',
            old_name='city_name',
            new_name='cityName',
        ),
        migrations.RenameField(
            model_name='city',
            old_name='created_at',
            new_name='createdAt',
        ),
        migrations.RenameField(
            model_name='city',
            old_name='updated_at',
            new_name='updatedAt',
        ),
        migrations.RenameField(
            model_name='electricitybill',
            old_name='created_at',
            new_name='createdAt',
        ),
        migrations.RenameField(
            model_name='electricitybill',
            old_name='updated_at',
            new_name='updatedAt',
        ),
        migrations.RenameField(
            model_name='electricitybill',
            old_name='upi_id',
            new_name='upiId',
        ),
        migrations.RenameField(
            model_name='rent',
            old_name='created_at',
            new_name='createdAt',
        ),
        migrations.RenameField(
            model_name='rent',
            old_name='updated_at',
            new_name='updatedAt',
        ),
        migrations.RenameField(
            model_name='rent',
            old_name='upi_id',
            new_name='upiId',
        ),
        migrations.RenameField(
            model_name='rooms',
            old_name='created_at',
            new_name='createdAt',
        ),
        migrations.RenameField(
            model_name='rooms',
            old_name='room_image',
            new_name='roomImage',
        ),
        migrations.RenameField(
            model_name='rooms',
            old_name='room_no',
            new_name='roomNo',
        ),
        migrations.RenameField(
            model_name='rooms',
            old_name='updated_at',
            new_name='updatedAt',
        ),
        migrations.RenameField(
            model_name='state',
            old_name='created_at',
            new_name='createdAt',
        ),
        migrations.RenameField(
            model_name='state',
            old_name='state_name',
            new_name='stateName',
        ),
        migrations.RenameField(
            model_name='state',
            old_name='updated_at',
            new_name='updatedAt',
        ),
        migrations.RenameField(
            model_name='tenant',
            old_name='created_at',
            new_name='createdAt',
        ),
        migrations.RenameField(
            model_name='tenant',
            old_name='updated_at',
            new_name='updatedAt',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='created_at',
            new_name='createdAt',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='first_name',
            new_name='firstName',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='last_name',
            new_name='lastName',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='mobile_no',
            new_name='mobileNo',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='updated_at',
            new_name='updatedAt',
        ),
        migrations.RenameField(
            model_name='userproperties',
            old_name='created_at',
            new_name='createdAt',
        ),
        migrations.RenameField(
            model_name='userproperties',
            old_name='property_image',
            new_name='propertyImage',
        ),
        migrations.RenameField(
            model_name='userproperties',
            old_name='property_name',
            new_name='propertyName',
        ),
        migrations.RenameField(
            model_name='userproperties',
            old_name='updated_at',
            new_name='updatedAt',
        ),
        migrations.RenameField(
            model_name='userrole',
            old_name='created_at',
            new_name='createdAt',
        ),
        migrations.RenameField(
            model_name='userrole',
            old_name='updated_at',
            new_name='updatedAt',
        ),
        migrations.RenameField(
            model_name='userrolelink',
            old_name='created_at',
            new_name='createdAt',
        ),
        migrations.RemoveField(
            model_name='userrolelink',
            name='updated_at',
        ),
        migrations.AddField(
            model_name='userrolelink',
            name='updatedAt',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='city',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='electricitybill',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='rent',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='rooms',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='state',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='tenant',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='userproperties',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='userrole',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='userrolelink',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
