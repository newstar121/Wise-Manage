import axios from 'axios'

const API_URL = 'https://api.charitycommission.gov.uk/register/api/';
const API_KEY = 'e1ee0567768248558586f9ade025c6cf';

const getCharityOverview = async (option) => {

    try {

        const number = parseInt(option.reg_charity_number);
        const suffix = parseInt(option.group_subsid_suffix);

        const result = await axios.get(API_URL + 'charityoverview/' + number + '/' + suffix,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Ocp-Apim-Subscription-Key': API_KEY,
                }
            }
        );

        return result.data || null;

    } catch (error) {
        console.log('error', error)
    }

}

export default async function handler(req, res) {
    try {

        let option = req.query;
        const response = await getCharityOverview(option);
        res.status(200).json(response)

    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}
