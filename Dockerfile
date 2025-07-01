FROM python:3.10-slim

WORKDIR /app
COPY . .

RUN python3 -m venv venv && \
    . venv/bin/activate && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

EXPOSE 7860
CMD ["venv/bin/python", "app.py"]
