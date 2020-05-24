const checkString = (kind, text) => {
  const type = typeof text

  if (type !== 'string') {
    throw new Error(`Invalid ${kind}`)
  }

  if (text.length === 0) {
    throw new Error(`Empty ${kind}`)
  }
}

const checkEmail = (email) => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  checkString('email', email)

  if (!regex.test(email)) {
    throw new Error('Invalid email format')
  }
}

const checkRegister = (body) => {
  checkString('username', body.username)
  checkString('fullname', body.fullname)
  checkString('password', body.password)
  checkEmail(body.email)
}

const checkLogin = (body) => {
  checkString('password', body.password)
  checkEmail(body.email)
}

module.exports = {
  checkRegister,
  checkLogin
}
