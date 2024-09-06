pipeline {
    agent any

    stages {
        stage('Install Frontend Dependencies') {
            steps {
                script {
                    sh '''
                        cd frontend
                        npm install
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh '''
                        cd frontend
                        npm run build
                    '''
                }
            }
        }

        stage('Deploy') {
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

        stage('Install Backend Dependencies') {
            steps {
                script {
                    sh '''
                        cd backend
                        npm install
                    '''
                }
            }
        }
        stage('Restart backend') {
            steps {
                script {
                    sh '''
                        cd backend

                        if pm2 list | grep -q 'hvac_backend'; then
                            pm2 restart hvac_backend
                        else
                            pm2 start index.js --name hvac_backend
                        fi
                    '''
                }
            }
        }
    }
}
