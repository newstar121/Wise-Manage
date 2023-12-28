import axios from 'axios'

const getBalance = async (startDay, endDay, type) => {
    try {
        const response = await axios.get(`/api/get_balance?startDay=${startDay}&endDay=${endDay}&type=${type}`);
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

        const response = await axios.get(`/api/get_charity?page_num=${option.page_num}&page_count=${option.page_count}&search=${option.search}&isNew=${option.isNew}&reg_charity_number=${option.sort.reg_charity_number}&charity_name=${option.sort.charity_name}&reg_status=${option.sort.reg_status}&income=${option.sort.income}&reporting=${option.sort.reporting}&date_of_registration=${option.sort.date_of_registration}`);
        return response.data || {};

    } catch (error) {
        console.log(error);
    }

    return false;
}

const getCharityOverview = async (option) => {

    try {

        const response = await axios.get(`/api/get_charity_overview?reg_charity_number=${option.reg_charity_number}&group_subsid_suffix=${option.group_subsid_suffix}`);
        return response.data || {};

    } catch (error) {
        console.log(error);
    }

    return false;
}

const getAllDetails = async (option) => {

    try {

        const response = await axios.get(`/api/get_all_details?reg_charity_number=${option.reg_charity_number}&group_subsid_suffix=${option.group_subsid_suffix}`);
        return response.data || {};

    } catch (error) {
        console.log(error);
    }

    return false;
}

const getAllGovernance = async (option) => {

    try {

        const response = await axios.get(`/api/get_all_governance?reg_charity_number=${option.reg_charity_number}&group_subsid_suffix=${option.group_subsid_suffix}`);
        return response.data || {};

    } catch (error) {
        console.log(error);
    }

    return false;
}

const getFinancialHistory = async (option) => {

    try {

        const response = await axios.get(`/api/get_financial_history?reg_charity_number=${option.reg_charity_number}&group_subsid_suffix=${option.group_subsid_suffix}`);
        return response.data || {};

    } catch (error) {
        console.log(error);
    }

    return false;
}

const getAccountsReturn = async (option) => {

    try {

        const response = await axios.get(`/api/get_accounts_return?reg_charity_number=${option.reg_charity_number}&group_subsid_suffix=${option.group_subsid_suffix}`);
        return response.data || [];

    } catch (error) {
        console.log(error);
    }

    return false;
}

const getGoverningDoc = async (option) => {

    try {

        const response = await axios.get(`/api/get_governing_doc?reg_charity_number=${option.reg_charity_number}&group_subsid_suffix=${option.group_subsid_suffix}`);
        return response.data || {};

    } catch (error) {
        console.log(error);
    }

    return false;
}

const getContactinfo = async (option) => {

    try {

        const response = await axios.get(`/api/get_contact_info?reg_charity_number=${option.reg_charity_number}&group_subsid_suffix=${option.group_subsid_suffix}`);
        return response.data || {};

    } catch (error) {
        console.log(error);
    }

    return false;
}

const wiseService = { getBalance, getBalances, getElectrics, getCharity, getCharityOverview, getAllDetails, getAllGovernance, getFinancialHistory, getAccountsReturn, getGoverningDoc, getContactinfo }

export default wiseService