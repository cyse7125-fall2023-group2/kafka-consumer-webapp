pipeline {
    agent any
    environment {
        GH_TOKEN  = credentials('GITHUB_CREDENTIALS_ID')
        GOOGLE_APPLICATION_CREDENTIALS = credentials('webapp-operator')
        HELM_CHART_REPO = 'https://github.com/cyse7125-fall2023-group2/kafka-consumer-helm'
        HELM_RELEASE_NAME = 'dev-kafka'
        NAMESPACE = 'consumer'
        PROJECT_ID = 'csye7125-cloud-79'
        CLUSTER_NAME = 'csye7125-cloud-79-gke'
        REGION = 'us-east1'
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

        stage('fetch git commit') {
            steps {
                sh 'git rev-parse HEAD > commit.txt'
            }
        }

        stage('app docker build and push') {
            steps {
                script {
                    // Define credentials for Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_ID', usernameVariable: 'dockerHubUsername', passwordVariable: 'dockerHubPassword')]) {
                        env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                        sh """
                            echo ${env.GIT_COMMIT}
                            docker login -u \${dockerHubUsername} -p \${dockerHubPassword}
                            docker build -t sumanthksai/consumer-webapp:${env.GIT_COMMIT} .
                            docker push sumanthksai/consumer-webapp:${env.GIT_COMMIT} 
                            docker build -t sumanthksai/fly-v2:latest ./database
                            docker push sumanthksai/fly-v2:latest
                        """
                    }
                }
            }
        }

        stage('Gcloud auth setup'){
            steps{
                script{
                        withCredentials([file(credentialsId: 'webapp-operator-gcp', variable: 'SA_KEY')]) {

                    sh """
                        gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
                        gcloud config set project ${PROJECT_ID}
                        gcloud container clusters get-credentials ${CLUSTER_NAME} --region ${REGION} --project ${PROJECT_ID}
                        """
                    }

                }
            }
        }

        stage('Create namespace and add istio label'){
            steps{
                script{
                    def cosumerNSExists = sh(script: "kubectl get namespace ${NAMESPACE}", returnStatus: true) == 0

                    if (!cosumerNSExists) {
                        sh """
                            kubectl create namespace ${NAMESPACE}
                        """
                    }

                    sh "kubectl label namespace ${NAMESPACE} istio-injection=enabled"
                }
            }
        }

        stage('make deploy'){
            steps{
                script{
                    withCredentials([usernamePassword(credentialsId: 'GITHUB_CREDENTIALS_ID', usernameVariable: 'githubUsername', passwordVariable: 'githubToken')]) {
                        git branch: 'main', credentialsId: 'GITHUB_CREDENTIALS_ID', url: 'https://github.com/cyse7125-fall2023-group2/kafka-consumer-helm' 
                        latestTag= sh(returnStdout: true, script: "git describe --abbrev=0 --tags | tr -d 'v' ").trim()
                        sh "echo ${latestTag}"

                    asset_name = "kafka-consumer-helm-${latestTag}.tgz"
                     sh "rm -f ${asset_name}"

                    withEnv(["GH_TOKEN=${githubToken}"]){
                        sh "gh release download ${latestTag} -R ${HELM_CHART_REPO} -p ${asset_name}"
                      }
                    def releaseExists = sh(script: "helm get values ${HELM_RELEASE_NAME} -n ${NAMESPACE}  > /dev/null 2>&1", returnStatus: true)                        
                      
                    if (releaseExists == 0) {
                            sh "helm upgrade ${HELM_RELEASE_NAME} ${asset_name} --set primaryContainer.tag=${GIT_COMMIT} --namespace=${NAMESPACE}"
                        } else {
                            sh "helm install ${HELM_RELEASE_NAME}  ${asset_name} --set primaryContainer.tag=${GIT_COMMIT} --namespace=${NAMESPACE}"
                        }
                    }
    
                }
            }
        }
    }
}

