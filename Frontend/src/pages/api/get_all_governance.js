import axios from 'axios'

const API_URL = 'https://api.charitycommission.gov.uk/register/api/';
const API_KEY = 'e1ee0567768248558586f9ade025c6cf';

const moveObj = (targetObj = {}, moveObj) => {

    const keys = Object.keys(moveObj);

    for (let i = 0; i < keys.length; i++) {
        targetObj[keys[i]] = moveObj[keys[i]]
    }

    return targetObj;

}

const getAllGovernance = async (option) => {

    try {

        const number = parseInt(option.reg_charity_number);
        const suffix = parseInt(option.group_subsid_suffix);

        let governance = {};

        let result = await axios.get(API_URL + 'charitygovernanceinformation/' + number + '/' + suffix,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Ocp-Apim-Subscription-Key': API_KEY,
                }
            }
        );

        governance = moveObj(governance, result.data);

        result = await axios.get(API_URL + 'charitygoverningdocument/' + number + '/' + suffix,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Ocp-Apim-Subscription-Key': API_KEY,
                }
            }
        );

        governance = moveObj(governance, result.data);

        result = await axios.get(API_URL + 'linkedcharities/' + number + '/' + suffix,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Ocp-Apim-Subscription-Key': API_KEY,
                }
            }
        );

        governance = moveObj(governance, { linkedcharities: result.data });

        result = await axios.get(API_URL + 'charityothernames/' + number + '/' + suffix,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Ocp-Apim-Subscription-Key': API_KEY,
                }
            }
        );

        governance = moveObj(governance, { charityothernames: result.data });

        result = await axios.get(API_URL + 'charityregistrationhistory/' + number + '/' + suffix,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Ocp-Apim-Subscription-Key': API_KEY,
                }
            }
        );

        governance = moveObj(governance, { charityregistrationhistory: result.data });

        return governance;

    } catch (error) {
        console.log('error', error)
    }

}

export default async function handler(req, res) {
    try {

        let option = req.query;
        const response = await getAllGovernance(option);
        res.status(200).json(response)

    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}