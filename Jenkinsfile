#!groovy
pipeline {
    agent any

    environment {
        NODE_VERSION = 'v10.15.0'
        NODE_MIRROR = 'https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/'
    }
    stages {
        stage('Prepare') {
            steps {
                nvm(
                    'version': env.NODE_VERSION,
                    'nvmNodeJsOrgMirror': env.NODE_MIRROR
                ) {
                    sh "node -v"
                    sh "npm -v"
                    sh "npm install"
                }
            }
        }
        stage('Build') {
            parallel {
                stage('Lint') {
                    steps {
                        nvm('version': env.NODE_VERSION) {
                            sh "npm run tslint"
                        }
                    }
                }
                stage('Compile') {
                    steps {
                        nvm('version': env.NODE_VERSION) {
                            sh "npm run build"
                        }
                    }
                }
            }
        }

    }
}
