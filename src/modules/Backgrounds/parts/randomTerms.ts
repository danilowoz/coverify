const wordList = [
  'party',
  'jazz',
  'dog',
  'eat',
  'guitar',
  'beer',
  'home',
  'cars',
  'landscape',
  'pattern',
  'city',
  'nature',
  'mountain',
  'film',
  'cassette',
  'summer',
  'health',
  'art',
  'brazil',
  'disco',
]

const getRandomWordList = () =>
  wordList[Math.floor(Math.random() * wordList.length)]

export { wordList, getRandomWordList }
