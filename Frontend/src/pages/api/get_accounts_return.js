import axios from 'axios'

const API_URL = 'https://api.charitycommission.gov.uk/register/api/';
const API_KEY = 'e1ee0567768248558586f9ade025c6cf';

const getAccountsReturn = async (option) => {

    try {

        const number = parseInt(option.reg_charity_number);
        const suffix = parseInt(option.group_subsid_suffix);

        const result = await axios.get(API_URL + 'charityaraccounts/' + number + '/' + suffix,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Ocp-Apim-Subscription-Key': API_KEY,
                }
            }
        );

        let data = [];

        for (let i = result.data.length - 2; i >= 0; i = i - 2) {
            result.data[i].id = i;
            data.push(result.data[i])
            result.data[i + 1].id = i + 1;
            if (!result.data[i + 1].date_received) result.data[i + 1].date_received = result.data[i].date_received;
            data.push(result.data[i + 1])
        }

        return data;

    } catch (error) {
        console.log('error', error)
    }

}

export default async function handler(req, res) {
    try {

        let option = req.query;
        const response = await getAccountsReturn(option);
        res.status(200).json(response)

    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}
