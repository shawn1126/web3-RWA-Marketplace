import axios from 'axios'

export const fetchPrice = async (coin) => {
  try {
    const fetchIt = await axios.get(`
    https://api.coingecko.com/api/v3/simple/price?ids=${coin}%2Cusd-coin&vs_currencies=usd`, {})
    console.log(fetchIt.data)
    return fetchIt.data
  } catch (error) {
    console.log("fetch coin price error", error)
  }
}