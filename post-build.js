import fs from 'node:fs'

const rnFiles = [{ from: 'react-native/native-entry', to: 'react-native/index' }]

const extensions = ['.d.cts', '.cjs', '.d.ts', '.js']

// Rename native-entry.* → index.* then replace 'appwrite' → 'react-native-appwrite'
for (const { from, to } of rnFiles) {
  for (const ext of extensions) {
    const src = from + ext
    const dest = to + ext
    fs.readFile(src, 'utf8', function (err, data) {
      if (err) {
        return console.log(err)
      }
      var result = data.replace(/'appwrite'/g, "'react-native-appwrite'")
      fs.writeFile(dest, result, 'utf8', function (err) {
        if (err) return console.log(err)
        // Remove the original file after writing
        if (src !== dest) {
          fs.unlink(src, function (err) {
            if (err) return console.log(err)
          })
        }
      })
    })
  }
}
