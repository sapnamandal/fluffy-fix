# Use the official Python image from Docker Hub
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY . .

# Expose the port Flask will run on
EXPOSE 5000

# Set the command to run the Flask app
CMD ["python", "api.py"]
