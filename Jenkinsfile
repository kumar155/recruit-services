pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('jenkins-docker')
        IMAGE_NAME = 'sadonthu/recruit-service'
        CONTAINER_NAME = 'recruit-service-container'
        registry = "sadonthu/recruit-service"
        registryCredential = 'jenkins-docker'
        dockerImage = ''

        // DOCKER_IMAGE = "yourusername/yourimage:latest"  // Docker image to pull
        TARGET_SERVER = "3.149.240.114"  // Replace with your target server's IP or hostname
        SSH_CREDENTIALS_ID = "recruit-services-ssh"  // Jenkins SSH credentials ID
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
                        def customImage = docker.build("${IMAGE_NAME}", "--file ${dockerfile} .")
                        customImage.push()
                    }
                }
            }
        }
        stage('Pull and Run Docker Image') {
            steps {
                script {
                    // SSH into the target machine and pull/run the Docker image
                    sshagent([SSH_CREDENTIALS_ID]) {
                        sh """
                            ssh -i ./recruit-services.pem ec2-user@${TARGET_SERVER}
                            ssh -o StrictHostKeyChecking=no user@${TARGET_SERVER} 'docker rm -f ${CONTAINER_NAME}'
                            ssh -o StrictHostKeyChecking=no user@${TARGET_SERVER} 'docker image pull ${IMAGE_NAME}'
                            ssh -o StrictHostKeyChecking=no user@${TARGET_SERVER} 'docker run -d --name ${CONTAINER_NAME} ${IMAGE_NAME}'
                        """
                    }
                }
            }
        }
        // stage('Pull Docker Image') {
        //     steps {
        //         script {
        //             sh "docker stop recruit-service-container"
        //             sh "docker rm -f recruit-service-container"
        //             sh "docker image pull sadonthu/recruit-service-1:latest"
        //         }
        //     }
        // }
        // stage('Run image') {
        //     steps {
        //         script {
        //             sh "docker run -d --name recruit-service-container-1 -p 3001:3001 sadonthu/recruit-service-1:latest"
        //         }
        //     }
        // }
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
