pipeline {
    agent any

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/CODELION-010/homepage.git'
            }
        }

        stage('Verificar archivos') {
            steps {
                sh '''
                    echo "📁 Verificando estructura de archivos..."
                    ls -la
                    echo "📄 Verificando index.html:"
                    test -f index.html && echo "✅ index.html existe" || echo "❌ index.html no existe"
                    echo "📁 Verificando directorio css:"
                    test -d css && echo "✅ directorio css existe" || echo "❌ directorio css no existe"
                    echo "📁 Verificando directorio js:"
                    test -d js && echo "✅ directorio js existe" || echo "❌ directorio js no existe"
                '''
            }
        }

        stage('Detener y eliminar contenedor') {
            steps {
                script {
                    try {
                        sh '''
                            echo "🛑 Deteniendo contenedores existentes..."
                            sudo docker-compose stop homepage || true
                            sudo docker-compose rm -f homepage || true
                            sudo docker stop homepage-app || true
                            sudo docker rm homepage-app || true
                        '''
                    } catch (Exception e) {
                        echo "ℹ️ No hay contenedores anteriores que detener"
                    }
                }
            }
        }

        stage('Corregir permisos') {
            steps {
                sh '''
                    echo "🔧 Corrigiendo permisos de archivos..."
                    sudo chmod -R 755 .
                    sudo chown -R $(whoami):$(whoami) .
                    
                    echo "📋 Permisos actuales:"
                    ls -la index.html
                    ls -la css/ || echo "css/ no existe"
                    ls -la js/ || echo "js/ no existe"
                '''
            }
        }

        stage('Reconstruir y levantar contenedor') {
            steps {
                sh '''
                    echo "🏗️ Construyendo y levantando contenedor..."
                    sudo docker-compose up -d --build homepage
                    
                    echo "⏳ Esperando que el contenedor inicie..."
                    sleep 10
                '''
            }
        }

        stage('Verificar despliegue') {
            steps {
                sh '''
                    echo "🔍 Verificando estado del contenedor..."
                    sudo docker ps | grep homepage || sudo docker ps -a | grep homepage
                    
                    echo "📋 Logs del contenedor:"
                    sudo docker logs homepage-app --tail 20 || true
                    
                    echo "🌐 Verificando conectividad HTTP..."
                    # Verificar desde dentro del contenedor
                    sudo docker exec homepage-app ls -la /usr/share/nginx/html/ || true
                    sudo docker exec homepage-app cat /etc/nginx/nginx.conf | head -20 || true
                    
                    echo "🔗 Probando conexión HTTP..."
                    timeout 30 sh -c 'until curl -f http://localhost:7400 >/dev/null 2>&1; do sleep 2; echo "Intentando conectar..."; done' || echo "⚠️ No se pudo conectar por HTTP"
                    
                    # Verificar response
                    echo "📄 Response del servidor:"
                    curl -I http://localhost:7400 || echo "❌ Error al obtener headers"
                '''
            }
        }

        stage('Diagnóstico adicional') {
            when {
                expression { currentBuild.currentResult == 'FAILURE' }
            }
            steps {
                sh '''
                    echo "🔍 Diagnóstico adicional por error..."
                    
                    echo "📦 Estado de Docker:"
                    sudo docker system df
                    
                    echo "🌐 Puertos en uso:"
                    sudo netstat -tlnp | grep :7400 || echo "Puerto 7400 no está en uso"
                    
                    echo "📁 Contenido del contenedor:"
                    sudo docker exec homepage-app ls -la /usr/share/nginx/html/ 2>/dev/null || echo "No se puede acceder al contenedor"
                    
                    echo "🔧 Configuración de Nginx:"
                    sudo docker exec homepage-app nginx -t 2>/dev/null || echo "Error en configuración de Nginx"
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 Deploy completado con éxito!'
            sh '''
                echo "📱 Aplicación disponible en:"
                echo "🌐 http://localhost:7400"
                echo "📊 Estado final:"
                sudo docker ps | grep homepage
                
                echo "📄 Test final:"
                curl -s http://localhost:7400 | head -5 || echo "❌ No se puede acceder a la aplicación"
            '''
        }
        failure {
            echo '❌ Falló el deploy'
            sh '''
                echo "🔍 Información de debug:"
                sudo docker ps -a | grep homepage || echo "No hay contenedores homepage"
                sudo docker images | grep homepage || echo "No hay imágenes homepage"
                
                echo "📋 Logs completos del contenedor:"
                sudo docker logs homepage-app || echo "No se pueden obtener logs"
                
                echo "🌐 Estado de puertos:"
                sudo netstat -tlnp | grep :7400 || echo "Puerto 7400 no está en uso"
            '''
        }
        always {
            echo '🧹 Limpieza final...'
        }
    }
}
