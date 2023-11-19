import axios from 'axios'
import info from '../../service/consts'

const baseurl = `${info.SERVER_BASE}`

const getCharity = async (option) => {

    try {

        const result = await axios.get(baseurl + `/charity?page_num=${option.page_num}&page_count=${option.page_count}&search=${option.search}&isNew=${option.isNew}&reg_charity_number=${option.reg_charity_number}&charity_name=${option.charity_name}&reg_status=${option.reg_status}&income=${option.income}&reporting=${option.reporting}`);
        return result.data || null;

    } catch (error) {
        console.log('error', error)
    }

}

export default async function handler(req, res) {
    try {

        let option = req.query;
        const response = await getCharity(option);
        res.status(200).json(response)
    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}
