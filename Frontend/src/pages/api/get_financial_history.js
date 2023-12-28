import axios from 'axios'
import moment from 'moment';

const API_URL = 'https://api.charitycommission.gov.uk/register/api/';
const API_KEY = 'e1ee0567768248558586f9ade025c6cf';

const getFinancialHistory = async (option) => {

    try {

        const number = parseInt(option.reg_charity_number);
        const suffix = parseInt(option.group_subsid_suffix);

        const result = await axios.get(API_URL + 'charityfinancialhistory/' + number + '/' + suffix,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Ocp-Apim-Subscription-Key': API_KEY,
                }
            }
        );

        let data = {
            column: [],
            row: []
        };

        data.column = ['Income/Expenditure'].concat(result.data.map((item) => moment(item.financial_period_end_date).format('DD/MM/YYYY')));

        let reverse = {};
        reverse.income = ['Total gross income'].concat(result.data.map((item) => item.income));
        reverse.exp_total = ['Total expenditure'].concat(result.data.map((item) => item.exp_total));
        reverse.income_from_govt_contracts = ['Income from government contracts'].concat(result.data.map((item) => item.income_from_govt_contracts));
        reverse.income_from_govt_grants = ['Income from government grants'].concat(result.data.map((item) => item.income_from_govt_grants));
        reverse.inc_donations_and_legacies = ['Income - Donations and legacies'].concat(result.data.map((item) => item.inc_donations_and_legacies));
        reverse.inc_other_trading_activities = ['Income - Other trading activities'].concat(result.data.map((item) => item.inc_other_trading_activities));
        reverse.inc_charitable_activities = ['Income - Charitable activities'].concat(result.data.map((item) => item.inc_charitable_activities));
        reverse.inc_endowments = ['Income - Endowments'].concat(result.data.map((item) => item.inc_endowments));
        reverse.inc_investment = ['Income - Investment'].concat(result.data.map((item) => item.inc_investment));
        reverse.inc_other = ['Income - Other'].concat(result.data.map((item) => item.inc_other));
        reverse.inc_legacies = ['Income - Legacies'].concat(result.data.map((item) => item.inc_legacies));
        reverse.expenditure = ['Expenditure - Charitable activities'].concat(result.data.map((item) => item.expenditure));
        reverse.exp_raising_funds = ['Expenditure - Raising funds'].concat(result.data.map((item) => item.exp_raising_funds));
        reverse.exp_governance = ['Expenditure - Governance'].concat(result.data.map((item) => item.exp_governance));
        reverse.exp_grants_institution = ['Expenditure - Grants institution'].concat(result.data.map((item) => item.exp_grants_institution));
        reverse.exp_investment_management = ['Expenditure - Investment management'].concat(result.data.map((item) => item.exp_investment_management));
        reverse.exp_other = ['Expenditure - Other'].concat(result.data.map((item) => item.exp_other));

        const keys = Object.keys(result.data[0]);

        for (let i = 0; i < keys.length; i++) {

            if (!reverse[keys[i]]) continue;
            let row = {}

            for (let j = 0; j < data.column.length; j++) {
                row[data.column[j]] = j == 0 ? reverse[keys[i]][j] : (reverse[keys[i]][j] == null ? 'N/A' : reverse[keys[i]][j])
            }

            data.row.push(row)

        }

        data.row.sort((a, b) => a['Income/Expenditure'] < b['Income/Expenditure'] ? 1 : -1)

        return data;

    } catch (error) {
        console.log('error', error)
    }

}

export default async function handler(req, res) {
    try {

        let option = req.query;
        const response = await getFinancialHistory(option);
        res.status(200).json(response)

    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}
