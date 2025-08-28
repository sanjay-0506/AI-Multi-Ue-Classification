# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies required for some Python packages
RUN apt-get update && \
    apt-get install -y build-essential cmake git && \
    apt-get install -y libomp-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy only requirements first (for caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy all app files into container
COPY app/ .

# Expose Flask port
EXPOSE 5000

# Run the Flask app
CMD ["python", "app.py"]

