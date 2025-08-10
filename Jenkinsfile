pipeline {
    agent any

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/CODELION-010/homepage.git'
            }
        }

        stage('Detener y eliminar contenedor') {
            steps {
                sh '''
                    sudo docker-compose stop homepage
                    sudo docker-compose rm -f homepage
                '''
            }
        }

        stage('Reconstruir y levantar contenedor') {
            steps {
                sh '''
                    sudo docker-compose up -d --build homepage
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
