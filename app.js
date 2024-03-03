const express = require('express')
const ejs = require('ejs')
const axios = require('axios')
const app = express()
const port = 3000
require('dotenv').config();

app.set('view engine', 'ejs') //ejs 뷰엔진 사용
app.set('views', './views') //파일 찾기

app.use(express.static(__dirname+'/public')) //static 미들웨어

//-------------------------------------------------------------

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/calculate', (req, res) => {
  res.render('calculate')
})

//-----------------------------------------------------------
//API result페이지에 연결 

function getAccessToken() {
  return axios({
    method: 'post',
    url: 'https://openapi.koreainvestment.com:9443/oauth2/tokenP',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    data: JSON.stringify({
      grant_type: 'client_credentials',
      appkey: process.env.appkey,
      appsecret: process.env.appsecret
    })
  })
  .then(response => {
    return response.data.access_token;
  })
  .catch(error => {
    console.log(error);
    return null;
  });
}

app.get('/result', (req, res) => {
  const stockName = req.query.stockName;
  getAccessToken().then(token => {
    axios.get('https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'appkey': process.env.appkey,
        'appsecret': process.env.appsecret
      },
      params: {
        'FID_COND_MRKT_DIV_CODE': 'J',
        'FID_INPUT_ISCD': stockName, // 종목 코드로 대체함
      }
    })
    .then(response => {
      const data = response.data.output;
      res.render('result', {
        stockName: stockName, 
        marketPrice: data.stck_prpr, 
        marketEPS: data.eps, 
        marketPER: data.per, 
        marketBPS: data.bps, 
        marketPBR: data.pbr, 
        marketROE: 'API지원X'
      })
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    })
  })
})


//-----------------------------------------------------------

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

//-----------------------------------------------------------