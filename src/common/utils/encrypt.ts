import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const secretKey = crypto
  .createHash('sha256')
  .update(String(process.env.DATA_SECRET_KEY ?? ''))
  .digest('base64')
  .substr(0, 32)
const ivSeed = 'cc3c56ad2530148d4890e8c0c25859a3'
const ivSeedBuffer = Buffer.from(ivSeed, 'hex')

export const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, ivSeedBuffer)

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

  return `encoded:${encrypted.toString('hex')}`
}

export const decrypt = (encodedHash: string) => {
  if (/^encoded:/.test(encodedHash)) {
    const hash = encodedHash.replace('encoded:', '')
    const decipher = crypto.createDecipheriv(algorithm, secretKey, ivSeedBuffer)
    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(hash, 'hex')),
      decipher.final(),
    ])

    return decrpyted.toString()
  }

  return encodedHash
}
