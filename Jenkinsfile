#!groovy
pipeline {
    agent any

    environment {}

    nvm(
        'version': 'v0.33.11',
        'nvmNodeJsOrgMirror': 'https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/'
    ) {
        stages {
            stage('Build') {

            }
            parallel {
                stage('Lint') {
                    steps {
                        sh """
                        which node
                        node -v
                        """
                    }
                }
                state('Compile') {
                    steps {
                        sh """
                        which npm
                        npm -v
                        """
                    }
                }
            }
        }
    }

    post {
        fixed {

        }
        regression {

        }
    }
}
