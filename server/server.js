const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const axios = require('axios')
const he = require('he')

const app = express()

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))
app.use(bodyParser.json())
// Update valori
app.post('/api/getData', (req,res) => {
    //chiamata a funzione di update stato lato Python
    axios({
      method: 'post',
      url: 'http://127.0.0.1:3002/getData',
      data: req.body
    }).then((results) =>{
        res.status(200).send(results.data.replace(/'/g, ''))
      })

    // axios.get('http://127.0.0.1:3002/getData')
    //   .then((results) => {
    //     res.status(200).send(JSON.parse(results.data.replace(/'/g, '')))
    //   })
})

// Update valori da PLC 1UW
app.post('/api/getUNWData', (req,res) => {
  //chiamata a funzione di update stato lato Python
  axios({
    method: 'post',
    url: 'http://172.17.5.31/awp/React/ProbeData.html',
    data: req.body,
  }).then((results) =>{
      var ans = he.decode(results.data)
      ans = ans.substring(ans.indexOf("{"))
      ans = JSON.parse(ans.substring(0,ans.lastIndexOf("}")+1).trim())
      res.status(200).send(ans)
    })

  // axios.get('http://127.0.0.1:3002/getData')
  //   .then((results) => {
  //     res.status(200).send(JSON.parse(results.data.replace(/'/g, '')))
  //   })
})

// impostazione setpoint
app.post('/api/set', (req,res) => {
    //chiamata a funzione di update stato lato Python
    axios({
      method: 'post',
      url: 'http://127.0.0.1:3002/set',
      data: req.body
    }).then((results) =>{
        res.status(200).send(results.data)
      })
})

// pulsante
app.post('/api/logicButton', (req,res) => {
    //chiamata a funzione di update stato lato Python
    axios({
      method: 'post',
      url: 'http://127.0.0.1:3002/logicButton',
      data: req.body
    }).then((results) =>{
        res.status(200).send(results.data)
      })
})

// selezione
app.post('/api/logicSelection', (req,res) => {
    //chiamata a funzione di update stato lato Python
    axios({
      method: 'post',
      url: 'http://127.0.0.1:3002/logicSelection',
      data: req.body
    }).then((results) =>{
        res.status(200).send(results.data)
      })
})




// // Handles any requests that don't match the ones above
// app.get('*', (req,res) =>{
//     res.sendFile(path.join(__dirname+'/build/index.html'))
// })

const port = process.env.PORT || 5000
app.listen(port)

console.log('App is listening on port ' + port)