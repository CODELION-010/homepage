pipeline {
    agent any

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://tu-repositorio.git'
            }
        }

        stage('Detener y eliminar contenedor') {
            steps {
                sh '''
                    docker compose stop homepage
                    docker compose rm -f homepage
                '''
            }
        }

        stage('Reconstruir y levantar contenedor') {
            steps {
                sh '''
                    docker compose up -d --build homepage
                '''
            }
        }
    }

    post {
        success {
            echo '🚀 Deploy completado con éxito'
        }
        failure {
            echo '❌ Falló el deploy'
        }
    }
}
