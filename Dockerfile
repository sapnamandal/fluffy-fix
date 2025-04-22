FROM python:3.9-slim


RUN apt-get update && apt-get install -y netcat-openbsd


WORKDIR /app
COPY . .


RUN pip install --no-cache-dir -r requirements.txt


CMD ["python", "api.py"]
