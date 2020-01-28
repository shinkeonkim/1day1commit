var express = require('express')
var python_shell = require('python-shell')

var app = express()

app.listen(3030, function() {
    console.log('server start on port 3030')
})

app.use(express.static('public'))
app.use(express.static('src'))

app.get('/',function(request, response) {
    console.log('/ response')
    response.send('Hello')
})

