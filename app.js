const express = require('express')
const ejs = require('ejs')

const app = express()
const port = 3000

app.set('view engine', 'ejs') //ejs 뷰엔진 사용
app.set('views', './views') //파일 찾기

app.use(express.static(__dirname+'/public')) //static 미들웨어

//-------------------------------------------------------------

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/result', (req, res) => {
  res.render('result')
})

app.get('/calculate', (req, res) => {
  res.render('calculate')
})

//-----------------------------------------------------------

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

//-----------------------------------------------------------