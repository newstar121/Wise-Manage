import axios from 'axios'

const getBalance = async (startDay, endDay, type) => {
    try {
        const response = await axios.get(`/api/get_balance?startDay=${startDay}&&endDay=${endDay}&&type=${type}`);
        if (type == 'json') {
            return response.data;
        }

        const bytes = new Uint8Array(response.data.data, 0, response.data.data.length);
        return type == 'json' ? response.data : new Blob([bytes]);
    } catch (error) {
        console.log(error);
    }

    return false;
}

const getBalances = async () => {
    try {

        const response = await axios.get(`/api/get_balances`);
        return response.data || [];

    } catch (error) {
        console.log(error);
    }

    return false;
}

const getElectrics = async () => {
    try {

        const response = await axios.get(`/api/get_electrics`);
        return response.data || [];

    } catch (error) {
        console.log(error);
    }

    return false;
}

const getCharity = async (option) => {
    try {

        const response = await axios.get(`/api/get_charity?page_num=${option.page_num}&page_count=${option.page_count}&search=${option.search}&isNew=${option.isNew}&reg_charity_number=${option.sort.reg_charity_number}&charity_name=${option.sort.charity_name}&reg_status=${option.sort.reg_status}&income=${option.sort.income}&reporting=${option.sort.reporting}`);
        return response.data || {};

    } catch (error) {
        console.log(error);
    }

    return false;
}

const wiseService = { getBalance, getBalances, getElectrics, getCharity }

export default wiseService