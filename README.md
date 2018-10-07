# NER CLI

A simple wrapper for the CLI version of the Standford NER library.

NER CLI provides a simple interface for running data through the Stanford Named Entity Recognizer Library. As of now the package only takes a string, and no configuration options.

# Installation

```bash
# Install with Yarn (recommended)
yarn add ner-cli

# Install with NPM
npm install ner-cli
```

# Usage

```javascript
// ES6
import ner from 'ner-cli'

let text = 'The fate of Lehman Brothers, the beleaguered investment bank, hung in the balance on Sunday as Federal Reserve officials and the leaders of major financial institutions continued to gather in emergency meetings trying to complete a plan to rescue the stricken bank.  Several possible plans emerged from the talks, held at the Federal Reserve Bank of New York and led by Timothy R. Geithner, the president of the New York Fed, and Treasury Secretary Henry M. Paulson Jr.';

(async () => {
  console.log(await ner.parse(text))
})()
// => {
//      organizations: [
//        'Lehman Brothers',
//        'Federal Reserve',
//        'Federal Reserve Bank of New York',
//        'New York Fed',
//        'Treasury'
//      ],
//      persons: [
//        'Timothy R. Geithner',
//        'Henry M. Paulson Jr'
//      ],
//      locations: []
//    }
```