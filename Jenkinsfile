pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('jenkins-docker')
        IMAGE_NAME = 'sadonthu/recruit-service'
        registry = "sadonthu/recruit-service"
        registryCredential = 'jenkins-docker'
        dockerImage = ''
    }

    stages {
        // stage('Checkout') {
        //     steps {
        //         sh 'pwd'
        //         sh 'echo "hello world"'
        //         git 'https://github.com/kumar155/recruit-services.git'
        //     }
        // }
        // stage('build docker image') {
        //     steps {
        //         sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER .'
        //     }
        // }
        // stage('login to dockerhub') {
        //     steps {
        //         sh 'echo $DOCKER_HUB_CREDENTIALS | docker login -u  build -t $IMAGE_NAME:$BUILD_NUMBER .'
        //     }
        // }
        stage('Build and Push Docker Image') {
            steps {
                sh 'pwd'
                sh 'echo ${BUILD_NUMBER}'
                script {
                    // Define the Dockerfile location
                    def dockerfile = './Dockerfile'
                    def buildNumber = '${BUILD_NUMBER}';

                    // Build and push the Docker image
                    docker.withRegistry('https://registry.hub.docker.com', 'jenkins-docker') {
                        def customImage = docker.build("sadonthu/recruit-service-1:latest", "--file ${dockerfile} .")
                        customImage.push()
                    }
                }
            }
        }
        stage('Pull Docker Image') {
            steps {
                script {
                    sh "docker stop recruit-service-container"
                    sh "docker rm -f recruit-service-container"
                    sh "docker image pull sadonthu/recruit-service-1:latest"
                }
            }
        }
        stage('Run image') {
            steps {
                script {
                    sh "docker run -d --name recruit-service-container-1 -p 3001:3001 sadonthu/recruit-service-1:latest"
                }
            }
        }
        // stage('Building our image') {
        //     steps{
        //         script {
        //             dockerImage = docker.build registry + ":$BUILD_NUMBER"
        //         }
        //     }
        // }
        // stage('Deploy our image') {
        //     steps{
        //         script {
        //             docker.withRegistry( '', registryCredential ) {
        //             dockerImage.push()
        //             }
        //         }
        //     }
        // }
    }
}
