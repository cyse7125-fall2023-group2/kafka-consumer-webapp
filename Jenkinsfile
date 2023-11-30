pipeline {
    agent any
    environment {
        GH_TOKEN  = credentials('GITHUB_CREDENTIALS_ID')
        GOOGLE_APPLICATION_CREDENTIALS = credentials('webapp-operator')
    }
    stages {
        stage('Fetch GitHub Credentials') {
            steps {
                script {
                    // Define credentials for GitHub
                    withCredentials([usernamePassword(credentialsId: 'GITHUB_CREDENTIALS_ID', usernameVariable: 'githubUsername', passwordVariable: 'githubToken')]) {
                        git branch: 'main', credentialsId: 'GITHUB_CREDENTIALS_ID', url: 'https://github.com/cyse7125-fall2023-group2/kafka-consumer-helm.git'        
                    }
                }
            }
        }
        stage('make deploy'){
            steps{
                script{
                        withCredentials([file(credentialsId: 'webapp-operator', variable: 'SA_KEY')]) {
    
                      sh """
                        gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
                        gcloud config set project ${PROJECT_ID}
                        gcloud container clusters get-credentials csye7125-cloud-003-gke --zone us-east1-b --project csye7125-cloud-003
                        helm install dev-kafka .
                         """
                    }
                }
            }
        }
    }
}