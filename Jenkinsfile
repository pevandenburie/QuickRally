#!groovy

node("docker") {
    docker.withRegistry('pevandenburie/quickrally', '<<your-docker-registry-credentials-id>>') {
    
        git url: "https://github.com/pevandenburie/QuickRally", credentialsId: 'pevandenburie'
    
        sh "git rev-parse HEAD > .git/commit-id"
        def commit_id = readFile('.git/commit-id').trim()
        println commit_id
    
        stage "build"
        def app = docker.build "quickrally"
    
        stage "publish"
        app.push 'master'
        app.push "${commit_id}"
    }
}
