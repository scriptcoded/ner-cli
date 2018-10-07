const path = require('path')
const shell = require('shelljs')
const tmp = require('tmp-promise')
const util = require('util')
const fs = require('fs')

const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

module.exports.nerPath = path.resolve('./ner')

/**
 * Taken from https://gist.github.com/davidrleonard/2962a3c40497d93c422d1269bcd38c8f
 * Thanks!
 */
function execAsync (cmd, opts = {}) {
  return new Promise(function (resolve, reject) {
    // Execute the command, reject if we exit non-zero (i.e. error)
    shell.exec(cmd, opts, function (code, stdout, stderr) {
      if (code !== 0) return reject(new Error(stderr))
      return resolve(stdout)
    })
  })
}

const cmdPattern = (input, output) => `java -mx600m -cp "*;lib/*" edu.stanford.nlp.ie.crf.CRFClassifier -loadClassifier classifiers/english.all.3class.distsim.crf.ser.gz -outputFormat inlineXML -textFile ${input} > ${output}`

const getTag = (text, name) => {
  let matchRegex = new RegExp(`<${name}>([^</>]*)</${name}>`, 'g')
  let replaceRegex = new RegExp(`</?${name}>`, 'g')
  return (text.match(matchRegex) || []).map(tag => tag.replace(replaceRegex, ''))
}

/**
 * Takes a string and parses it into locations, persons and
 * organizations using the CLI version of the Standford NER
 * library.
 *
 * Uses temporary files to pass data to the binary.
 * @param {string} text The text to be parsed.
 * @returns {Object} The data retrieved from the string.
 */
module.exports.parse = async (text) => {
  let inputFile = await tmp.file()
  let outputFile = await tmp.tmpName({ postfix: '.tmp' })
  await writeFile(inputFile.path, text)

  let command = cmdPattern(
    inputFile.path,
    outputFile
  )

  shell.cd(module.exports.nerPath)
  await execAsync(command, {
    silent: true
  })
  let result = (await readFile(outputFile)).toString()

  let locations = getTag(result, 'LOCATION')
  let persons = getTag(result, 'PERSON')
  let organizations = getTag(result, 'ORGANIZATION')

  return {
    organizations,
    persons,
    locations
  }
}
