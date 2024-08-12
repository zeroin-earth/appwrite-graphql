var fs = require('fs')
fs.readFile('react-native/index.d.ts', 'utf8', function (err, data) {
  if (err) {
    return console.log(err)
  }
  var result = data.replace(/'appwrite';/g, "'react-native-appwrite';")

  fs.writeFile('react-native/index.d.ts', result, 'utf8', function (err) {
    if (err) return console.log(err)
  })
})

fs.readFile('react-native/index.js', 'utf8', function (err, data) {
  if (err) {
    return console.log(err)
  }
  var result = data.replace(/'appwrite'\);/g, "'react-native-appwrite');")

  fs.writeFile('react-native/index.js', result, 'utf8', function (err) {
    if (err) return console.log(err)
  })
})
