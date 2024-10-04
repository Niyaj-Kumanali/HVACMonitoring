pipeline {
    agent any

    environment {
        CACHE_DIR = '.npm'
    }

    stages {
        stage('Install Frontend Dependencies') {
            steps {
                script {
                    sh '''
                        cd frontend
                        npm ci --cache $CACHE_DIR
                    '''
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                script {
                    sh '''
                        cd backend
                        npm ci --cache $CACHE_DIR
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    sh '''
                        cd frontend
                        npm run build
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                script {
                    sh '''
                        cd frontend
                        sudo cp -r dist/* /var/www/hvac/
                    '''
                }
            }
        }

        stage('Reload Nginx') {
            steps {
                script {
                    sh '''
                        sudo systemctl reload nginx
                    '''
                }
            }
        }

        stage('Restart Backend') {
            steps {
                script {
                    sh '''
                        cd backend
                        echo "Restarting hvac_backend..."
                        pm2 restart hvac_backend --update-env || pm2 start index.js --name hvac_backend --update-env
                        pm2 save

                        echo "PM2 process list after restarting:"
                        pm2 list
                    '''
                }
            }
        }
    }
}
