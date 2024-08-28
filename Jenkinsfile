pipeline {
    agent any
    tools {
        nodejs 'nodejs'  // Make sure 'nodejs' refers to the Node.js version you have configured in Jenkins
    }

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    // Navigate to frontend directory and install dependencies
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
                    // Build the project in the frontend directory
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
                    // Copy built files to the Nginx directory
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
                    // Validate Nginx configuration and reload it
                    sh '''
                    sudo systemctl reload nginx
                    '''
                }
            }
        }
    }
}
