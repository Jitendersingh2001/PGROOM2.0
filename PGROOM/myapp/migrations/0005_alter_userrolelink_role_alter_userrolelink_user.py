# Generated by Django 5.1.5 on 2025-01-27 17:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0004_alter_city_state'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userrolelink',
            name='role',
            field=models.ForeignKey(db_column='roleId', on_delete=django.db.models.deletion.CASCADE, to='myapp.userrole'),
        ),
        migrations.AlterField(
            model_name='userrolelink',
            name='user',
            field=models.ForeignKey(db_column='userId', on_delete=django.db.models.deletion.CASCADE, related_name='role_links', to='myapp.user'),
        ),
    ]
