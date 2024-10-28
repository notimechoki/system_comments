FROM python:3.12

WORKDIR /app
COPY ./comment_back /app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "comment_back.asgi:application"]