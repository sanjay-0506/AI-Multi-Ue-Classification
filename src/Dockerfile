# Use official lightweight Python image
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app

# Copy requirements.txt into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app folder into the container
COPY app/ ./app/

# Set working directory to app folder
WORKDIR /app/app

# Expose Flask port
EXPOSE 5000

# Run Flask app
CMD ["python", "app.py"]
