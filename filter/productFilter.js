const checkString = (kind, text) => {
  const type = typeof text

  if (type !== 'string') {
    throw new Error(`Invalid ${kind}`)
  }

  if (text.length === 0) {
    throw new Error(`Empty ${kind}`)
  }
}

const checkNumber = (kind, number) => {
  if (!Number.isInteger(parseInt(number))) { 
    throw new Error(`Invalid ${kind}`) 
  }
}

const checkQuery = (query) => {
  if (query.name) checkString('query name', query.name)
  if (query.category) checkString('query category', query.category)
  if (query.rating) checkNumber('query rating', query.rating)
  if (query.minprice) checkNumber('query min price', query.minprice)
  if (query.maxprice) checkNumber('query min price', query.maxprice)
}

const checkPage = (query) => {
  if (query.page) checkNumber('page', body.page)
}

const checkId = (id) => {
  checkString('id', id)
}

module.exports = {
  checkQuery,
  checkPage,
  checkId
}
