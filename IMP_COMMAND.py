"""

-> TO activate the venv: - source myenv/bin/activate
-> To Run the python server: - python manage.py runserver
-> To Run the python server on a specific port: - python manage.py createsuperuser

-> DOCKER COMMANDS: - 
docker run --name my_postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin123 -e POSTGRES_DB=pgrooms -p 5432:5432 -d postgres

-> TO cerate an app: - python manage.py startapp <app_name>

->TO Migrate the models: - python manage.py makemigrations
->TO Migrate the models: - python manage.py migrate

"""