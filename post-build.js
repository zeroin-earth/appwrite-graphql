import fs from 'node:fs'

fs.readFile('react-native/index.d.cts', 'utf8', function (err, data) {
  if (err) {
    return console.log(err)
  }
  var result = data.replace(/'appwrite'/g, "'react-native-appwrite'")

  fs.writeFile('react-native/index.d.cts', result, 'utf8', function (err) {
    if (err) return console.log(err)
  })
})

fs.readFile('react-native/index.cjs', 'utf8', function (err, data) {
  if (err) {
    return console.log(err)
  }
  var result = data.replace(/'appwrite'/g, "'react-native-appwrite'")

  fs.writeFile('react-native/index.cjs', result, 'utf8', function (err) {
    if (err) return console.log(err)
  })
})
