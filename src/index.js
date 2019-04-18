import MainApp from './main.es6'

// Create an SVG renderer and attach it to the DIV element named "boo".
var div = document.getElementById('vexflow')

var app = new MainApp(div)

app.draw()
