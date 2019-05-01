pipeline {
  agent any
  stages {
    stage('Run tests') {
      steps {
        echo 'Hello world!'
      }
    }
    stage('Push to production') {
      steps {
        sh '''git checkout master
git pull origin master'''
        sh 'ssh-agent bash -c \'ssh-add /home/jenkins-keys/id_rsa; git push --force -u ssh://git@10.28.5.29/home/git/SJSU-CADRE/CADRE_SWITCH.git master\''
      }
    }
  }
}