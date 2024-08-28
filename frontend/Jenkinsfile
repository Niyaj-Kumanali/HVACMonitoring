pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    // Install dependencies
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // Build the project
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh 'ls'
                    sh 'sudo cp -r dist/* /var/www/HVAC/'
                }
            }
        }


        stage('Reload Nginx') {
            steps {
                script {
                    // Reload Nginx to pick up the new changes
                    sh 'sudo systemctl reload nginx'
                }
            }
        }
    }
}
