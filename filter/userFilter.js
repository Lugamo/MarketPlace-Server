const checkString = (kind, text) => {
  const type = typeof text

  if (type !== 'string') {
    throw new Error(`Invalid ${kind}`)
  }

  if (text.length === 0) {
    throw new Error(`Empty ${kind}`)
  }
}

const checkIds = (userId, productId) => {
  checkString('user id', userId)
  checkString('product id', productId)
}

const checkUserId = (userId) => {
  checkString('user id', userId)
}

module.exports = {
  checkIds,
  checkUserId
}
