const sgMail = require('@sendgrid/mail')
export default async function handler(req, res) {
    sgMail.setApiKey("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")
    const msg = {
  to: 'webn444@gmail.com', // Change to your recipient
  from: 'webn444@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}