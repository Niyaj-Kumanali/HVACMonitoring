pipeline {
    agent any

    stages {
        // stage('Install Frontend Dependencies') {
        //     steps {
        //         script {
        //             sh '''
        //                 cd frontend
        //                 npm install
        //             '''
        //         }
        //     }
        // }

        // stage('Build') {
        //     steps {
        //         script {
        //             sh '''
        //                 cd frontend
        //                 npm run build
        //             '''
        //         }
        //     }
        // }

        // stage('Deploy') {
        //     steps {
        //         script {
        //             sh '''
        //                 cd frontend
        //                 sudo cp -r dist/* /var/www/hvac/
        //             '''
        //         }
        //     }
        // }

        // stage('Reload Nginx') {
        //     steps {
        //         script {
        //             sh '''
        //                 sudo systemctl reload nginx
        //             '''
        //         }
        //     }
        // }

        // stage('Install Backend Dependencies') {
        //     steps {
        //         script {
        //             sh '''
        //                 cd backend
        //                 npm install
        //             '''
        //         }
        //     }
        // }
        
        stage('Restart backend') {
            steps {
                script {
                    sh '''  
                        sudo -u ubuntu pm2 list                    
                        pm2 list

                    '''
                }
            }
        }
    }
}

// echo "Force restarting hvac_backend..."
// pm2 delete hvac_backend || true
// pm2 start index.js --name hvac_backend --update-env
// pm2 save

// echo "PM2 process list after restarting:"
// pm2 list
// sleep 10
// pm2 restart hvac_backend --update-env
// pm2 list
