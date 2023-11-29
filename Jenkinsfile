pipeline {
    agent any
    environment {
        GH_TOKEN  = credentials('GITHUB_CREDENTIALS_ID')
    }
    stages {
        stage('Fetch GitHub Credentials') {
            steps {
                script {
                    // Define credentials for GitHub
                    withCredentials([usernamePassword(credentialsId: 'GITHUB_CREDENTIALS_ID', usernameVariable: 'githubUsername', passwordVariable: 'githubToken')]) {
                        git branch: 'main', credentialsId: 'GITHUB_CREDENTIALS_ID', url: 'https://github.com/cyse7125-fall2023-group2/kafka-consumer-webapp'        
                    }
                }
            }
        }
        
        stage('ci-checks') {
            steps {
                sh '''
                node --version
                npm --version
                npm ci
                '''
            }
        }

        stage('release') {
            steps {
                script {
                    // Define credentials for GitHub
                    withCredentials([usernamePassword(credentialsId: 'GITHUB_CREDENTIALS_ID', usernameVariable: 'githubUsername', passwordVariable: 'githubToken')]) {
                      withEnv(["GH_TOKEN=${githubToken}"]){
                       sh """
                            npx semantic-release
                       """
                      }     
                    }
                }
            }
        }
        stage('post-release') {
            steps {
                script {
                    // Define credentials for GitHub
                    withCredentials([usernamePassword(credentialsId: 'GITHUB_CREDENTIALS_ID', usernameVariable: 'githubUsername', passwordVariable: 'githubToken')]) {
                    version_id= sh(returnStdout: true, script: "git describe --abbrev=0 --tags | tr -d 'v' ").trim()
                }
            }
        }
        }

        stage('docker version') {
            steps {
                sh 'docker --version'
            }
        }
        stage('app docker build and push') {
            steps {
                script {
                    // Define credentials for Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_ID', usernameVariable: 'dockerHubUsername', passwordVariable: 'dockerHubPassword')]) {
                        sh """
                            echo ${version_id}
                            docker login -u \${dockerHubUsername} -p \${dockerHubPassword}
                            docker build -t sumanthksai/csye7125-consumer-webapp:${version_id} .
                            docker push sumanthksai/csye7125-consumer-webapp:${version_id} 
                            docker build -t sumanthksai/csye7125-consumer-flyway:latest ./database
                            docker push sumanthksai/csye7125-consumer-flyway:latest
                        """
                    }
                }
            }
        }
    }


}
