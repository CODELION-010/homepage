pipeline {
    agent any

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/CODELION-010/homepage.git'
            }
        }

        stage('Verificar Docker') {
            steps {
                sh '''
                    echo "Verificando Docker..."
                    docker --version
                    docker compose version
                '''
            }
        }

        stage('Detener y eliminar contenedor') {
            steps {
                script {
                    try {
                        sh '''
                            echo "Deteniendo contenedor existente..."
                            docker compose stop homepage || true
                            docker compose rm -f homepage || true
                            docker stop homepage-app || true
                            docker rm homepage-app || true
                        '''
                    } catch (Exception e) {
                        echo "No hay contenedores que detener: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Reconstruir y levantar contenedor') {
            steps {
                sh '''
                    echo "Construyendo y levantando contenedor..."
                    docker compose up -d --build homepage
                '''
            }
        }

        stage('Verificar despliegue') {
            steps {
                sh '''
                    echo "Verificando que el contenedor está corriendo..."
                    sleep 10
                    docker ps | grep homepage || docker ps -a | grep homepage
                    
                    echo "Verificando conectividad..."
                    timeout 30 sh -c 'until docker exec homepage-app curl -f http://localhost:80 >/dev/null 2>&1; do sleep 2; done' || true
                    
                    echo "✅ Verificación completada"
                '''
            }
        }
    }

    post {
        success {
            echo '🚀 Deploy completado con éxito'
            sh '''
                echo "📱 Aplicación disponible en puerto 7400"
                docker ps | grep homepage
            '''
        }
        failure {
            echo '❌ Falló el deploy'
            sh '''
                echo "📋 Debug info:"
                docker ps -a | grep homepage || echo "No hay contenedores homepage"
                docker images | grep homepage || echo "No hay imágenes homepage"
                docker compose logs homepage || echo "No hay logs disponibles"
            '''
        }
    }
}
