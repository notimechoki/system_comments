# Проект "Система комментариев"

## Описание
Это система комментариев, разработанная с использованием **Django** для бэкенда и **React** для фронтенда. В проекте применяются **Django Channels** для асинхронной обработки, **Django REST Framework** для создания API и **CORS** для взаимодействия между фронтендом и бэкендом. Контейнеризация осуществляется с помощью Docker.


## Структура следующая
system_comments/ 
├── backend/ 
│ ├── venv/ 
│ └── comment_back/ 
| │ ├── comment_back/ 
| │ ├── comments/ 
| │ ├── manage.py 
| │ ├── requirements.txt 
| │ ├── Dockerfile 
├── frontend/ 
│ ├── src/ 
│ ├── public/ 
│ ├── Dockerfile 
└── docker-compose.yml

- **backend/comment_back** — Django проект с настройками Channels, Django REST Framework и CORS.
- **frontend** — React проект для интерфейса системы комментариев.


## Технологии
- **Backend**: Django, Django REST Framework, Django Channels, CORS
- **Frontend**: React
- **Контейнеризация**: Docker, Docker Compose



## Установка и запуск проекта

### Шаг 1: Клонирование репозитория
Сначала клонируйте репозиторий на локальную машину:
```bash
git clone <URL репозитория>
cd system_comments
```

### Шаг 2: Настройка Docker и Docker Compose
В корневой папке проекта находится файл docker-compose.yml, который автоматически запустит контейнеры для фронтенда и бэкенда.
Запустите Docker Compose с флагом --build для сборки образов:
```bash
docker-compose up --build
```

#### После запуска команд:
- **Фронтенд будет доступен по адресу:** http://localhost:3000
- **Бэкенд будет доступен по адресу:** http://localhost:8000

### Шаг 3: Остановка контейнеров
Чтобы остановить все контейнеры, используйте команду:
```bash
docker-compose down
```



## Основные Endpoints API
- **GET /api/comments/** — получение списка комментариев
- **POST /api/comments/** — добавление нового комментария
- **WebSocket /ws/comments/** — для получения обновлений комментариев в реальном времени


## Доступ/Создание Администраторского Пользователя

В системе уже создан учетная запись администратора:
- **Логин**: `admin`
- **Пароль**: `admin`

Если вы хотите создать нового администратора, выполните следующие шаги:
1. Перейдите в директорию `backend/comment_back`:
   ```bash
   cd backend/comment_back
   python manage.py createsuperuser
   ```

После создания, новый пользователь сможет входить в панель администратора, доступную по адресу http://localhost:8000/admin.