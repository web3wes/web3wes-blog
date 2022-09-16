import nodemailer from "nodemailer"
const mail = require("@sendgrid/mail")
import { NextApiRequest, NextApiResponse } from "next"

export async function sendLoginEmail({
  email,
  url,
  token,
}: {
  email: string
  url: string
  token: string
}) {
  const testAccount = await nodemailer.createTestAccount()

  mail.setApiKey(process.env.SEND_GRID_API_KEY)

  await mail.send({
    to: email,
    from: "wes@relang.me",
    subject: "Login to your account",

    html: `Hi there!
    <br>
    <br>
    
    Word is you want to log in to Web3Wes' Blog app. You  can log in by clicking <a href="${url}/login#token=${token}"> here! </a><br>
  
    <br>
    Thanks for coming! 🙏<br>
    `,
  })

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })

  const info = await transporter.sendMail({
    from: '"Jane Doe" <j.doe@example.com>',
    to: email,
    subject: "Login to your account",
    html: `Login by clicking <a href="${url}/login#token=${token}">HERE</a>`,
  })

  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
}
