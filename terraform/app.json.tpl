[
    {
        "name": "app-live",
        "image": "${app_image}",
        "essential": true,
        "memoryReservation": 512,
        "mountPoints": [],
        "portMappings": [],
        "volumesFrom": [],
        "cpu": 0,
        "environment": [
            {"name": "SECRET", "value": "${secret}"},
        ],
        "logConfiguration": {
            "logDriver": "awsfirelens",
                "options": {
                  "Name": "datadog",
                  "apikey": "${dd_api_key}",
                  "Host": "http-intake.logs.datadoghq.eu",
                  "dd_service": "app-prod",
                  "dd_source": "app",
                  "dd_message_key": "log",
                  "dd_tags": "project:app-prod",
                  "TLS": "on",
                  "provider": "ecs"
            }
        }
    }
]