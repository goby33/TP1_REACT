import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });

const CAT_FACT_URL = 'https://cat-fact.herokuapp.com/facts/random'
const RANDOM_FOX_URL = 'https://randomfox.ca/floof/'
const COUNTRY_HOLIDAYS_URL = 'https://date.nager.at/api/v3/publicholidays/2022/'

const getCatFacts = async (amount) => await axios.get(CAT_FACT_URL + '?amount=' + amount)
    .then((response) => response.data.map(item => item.text))
    .catch(() => null)

const getFoxPicture = async () => await axios.get(RANDOM_FOX_URL)
    .then((response) => response.data.image)
    .catch(() => null)


const getCountryHolidays = async (countryCode) => await axios.get(COUNTRY_HOLIDAYS_URL + countryCode)
    .then((response) => response.data)
    .catch(() => null)


app.post('/', async (req, res) => {
  let catFacts = await getCatFacts(3)
  let foxPicture = await getFoxPicture()
  let holidays = await getCountryHolidays(req.body?.countryCode ?? "FR")
  return {
    foxPicture,
    catFacts,
    holidays,
  };
});

// Only used for dev server, do not remove
app.head('/', () => ({ ping: 'pong' }));

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
