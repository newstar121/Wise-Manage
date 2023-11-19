import axios from 'axios'
import info from '../../service/consts'

const baseurl = `${info.SERVER_BASE}`

const getElectrics = async () => {

    try {

        const result = await axios.get(baseurl + '/electric');
        // console.log(result);
        return result.data.data;
    } catch (error) {
        console.log('error', error)
    }

}

export default async function handler(req, res) {
    try {
        const response = await getElectrics();
        if (response === false) {
            return res.status(500).end("Octopus Error")
        } else {
            res.status(200).json(response)
        }
    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}
