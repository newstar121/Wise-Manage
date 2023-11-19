const express = require("express");
const axios = require('axios');
const moment = require('moment');

const { Charity } = require("../db");

const API_URL = 'https://api.charitycommission.gov.uk/register/api/';
const API_KEY = 'e1ee0567768248558586f9ade025c6cf';

function dataConvert(date) {

    // Parse the date string
    let dateStr = moment(date);

    // Get the date in the desired format
    let result = dateStr.format('YYYY-MM-DDTHH:mm:ss');
    return result;

}

function compareUpdate(exist, record) {

    if (exist.organisation_number == record.organisation_number &&
        exist.reg_charity_number == record.reg_charity_number &&
        exist.group_subsid_suffix == record.group_subsid_suffix &&
        exist.charity_name == record.charity_name &&
        exist.reg_status == record.reg_status &&
        dataConvert(exist.date_of_registration) == record.date_of_registration &&
        dataConvert(exist.date_of_removal) == record.date_of_removal &&
        exist.income == record.income &&
        exist.reporting == record.reporting &&
        dataConvert(exist.last_modified_time) == record.last_modified_time) return false;
    else return true

}

let isPulling = false;

async function GetCharityList() {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    for (let year = 2023; year <= currentYear; year++) {

        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        try {

            const response = await axios.get(API_URL + 'searchCharityRegDate/' + startDate + '/' + endDate,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Ocp-Apim-Subscription-Key': API_KEY,
                    }
                }
            );

            for (let i = 0; i < response.data.length; i++) {

                let record = {
                    organisation_number: `${response.data[i].organisation_number}`,
                    reg_charity_number: `${response.data[i].reg_charity_number}`,
                    group_subsid_suffix: response.data[i].group_subsid_suffix,
                    charity_name: response.data[i].charity_name?.trim(),
                    reg_status: response.data[i].reg_status?.trim(),
                    date_of_registration: response.data[i].date_of_registration?.trim(),
                    date_of_removal: response.data[i].date_of_removal?.trim(),
                    new: true
                }

                try {

                    const detailResult = await axios.get(API_URL + 'allcharitydetails/' + record.reg_charity_number + '/' + record.group_subsid_suffix,
                        {
                            headers: {
                                'Cache-Control': 'no-cache',
                                'Ocp-Apim-Subscription-Key': API_KEY,
                            }
                        }
                    );

                    record.income = detailResult.data.latest_income;
                    record.reporting = detailResult.data.reporting_status;
                    record.last_modified_time = detailResult.data.last_modified_time;

                    if (moment().isAfter(moment(record.last_modified_time).subtract(3, 'days'), 'day')) continue;

                    const exist = await Charity.findOne({
                        organisation_number: record.organisation_number,
                        reg_charity_number: record.reg_charity_number
                    });


                    if (exist) {

                        record.new = compareUpdate(exist, record);
                        Charity.findByIdAndUpdate(exist.id, record);

                    } else {

                        const charity = new Charity(record);
                        charity.save()

                    }

                } catch (error) {

                    console.log('allcharitydetails error', error);

                }

            }

        } catch (error) {

            console.log('searchCharityRegDate error', error);

        }

    }

    isPulling = false;

}

const charityRouter = express.Router();

// GET a product
charityRouter.get("/api/charity", async (req, res) => {

    try {

        let queryOption = { reg_status: 'R' };

        let page_num = parseInt(req.query.page_num);
        let page_count = parseInt(req.query.page_count);

        if (req.query.isNew == 'true') queryOption.reporting = 'New';
        else delete queryOption.reporting;

        if (req.query.search) {
            queryOption = {
                $or: [
                    { charity_name: { $regex: new RegExp(req.query.search, 'i') } },
                    { reg_charity_number: { $regex: new RegExp(req.query.search, 'i') } },
                ],
                reg_status: 'R'
            }
        }

        let sort = {
            // last_modified_time: -1,
        }

        if (req.query.reg_charity_number && req.query.reg_charity_number != 'undefined') {
            sort.reg_charity_number = req.query.reg_charity_number || null;
        }

        if (req.query.charity_name && req.query.charity_name != 'undefined') {
            sort.charity_name = req.query.charity_name || null;
        }

        if (req.query.reg_status && req.query.reg_status != 'undefined') {
            sort.reg_status = req.query.reg_status || null;
        }

        if (req.query.income && req.query.income != 'undefined') {
            sort.income = parseInt(req.query.income) || null;
        }

        if (req.query.reporting && req.query.reporting != 'undefined') {
            sort.reporting = req.query.reporting || null;
        }


        if (page_num < 0 || !page_num) page_num = 0;
        if (page_count < 1 || !page_count) page_count = 50;

        const total = await Charity.countDocuments(queryOption);

        const result = await Charity.find(queryOption).sort(sort).skip((page_num) * page_count).limit(page_count);

        res.send({
            status: true,
            data: result || [],
            total: total,
            page_count: page_count,
            page_num: page_num
        });

        if (!isPulling) {
            isPulling = true;
            GetCharityList();
        }

    } catch (error) {

        console.log(error);
        res.send({ status: false, data: [] });

    }
});

module.exports = { charityRouter };
