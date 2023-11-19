const express = require("express");
const axios = require('axios');
const { subYears, subWeeks } = require('date-fns');
const { Electric } = require("../db/");

const API_URL = 'https://api.octopus.energy/v1'

const ACCOUNT = ['ohc@ohcgroup.com', 'mail@therent.guru'];
const API_KEY = ['sk_live_KuIWosqLecc6YlE2cyFcSGMa', 'sk_live_D8nPKg0iJJmvEnLTcw7qzOlI'];

async function GetBalance() {

    try {

        const result = [];

        const currentDate = new Date();
        const oneYearAgo = subYears(currentDate, 1);
        const startDate = oneYearAgo.toISOString().substr(0, oneYearAgo.toISOString().length - 5) + 'Z';
        const oneWeekAgo = subWeeks(currentDate, 1);
        const propertyDate = oneWeekAgo.toISOString().substr(0, oneYearAgo.toISOString().length - 5) + 'Z';

        for (let i = 0; i < API_KEY.length; i++) {
            const obtainKrakenTokenResult = await axios.post(API_URL + '/graphql/',
                {
                    "operationName": "obtainKrakenToken",
                    "variables": {
                        "input": {
                            "APIKey": API_KEY[i]
                        }
                    },
                    "query": "mutation obtainKrakenToken($input: ObtainJSONWebTokenInput!) {\n  obtainKrakenToken(input: $input) {\n    token\n    refreshToken\n    __typename\n  }\n}\n"
                }
            );

            const obtainKrakenToken = obtainKrakenTokenResult.data.data.obtainKrakenToken;
            const token = obtainKrakenToken.token;
            // const refreshToken = obtainKrakenToken.refreshToken;

            const accountResult = await axios.post(API_URL + '/graphql/',
                {
                    "operationName": "getLoggedInUser",
                    "variables": {},
                    "query": "query getLoggedInUser {\n  viewer {\n    accounts {\n      number\n      balance\n      __typename\n    }\n    __typename\n  }\n}\n"
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            const accounts = accountResult.data.data.viewer?.accounts || [];

            for (let j = 0; j < accounts.length; j++) {
                try {

                    const unitResult = await axios.post(API_URL + '/graphql/',
                        {
                            "operationName": "getProperties",
                            "variables": {
                                "accountNumber": accounts[j].number,
                                "propertiesActiveFrom": propertyDate
                            },
                            "query": "query getProperties($accountNumber: String!, $propertiesActiveFrom: DateTime) {\n  account(accountNumber: $accountNumber) {\n    accountType\n    properties(activeFrom: $propertiesActiveFrom) {\n      id\n      address\n      occupancyPeriods {\n        effectiveFrom\n        effectiveTo\n        __typename\n      }\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      electricityMeterPoints {\n        __typename\n        mpan\n        id\n        gspGroupId\n        meters(includeInactive: false) {\n          id\n          serialNumber\n          makeAndType\n          meterType\n          importMeter {\n            id\n            __typename\n          }\n          smartDevices {\n            paymentMode\n            deviceId\n            __typename\n          }\n          __typename\n        }\n        agreements {\n          id\n          validFrom\n          validTo\n          isRevoked\n          unitRateUplifts {\n            unitRateUplift\n            __typename\n          }\n          tariff {\n            __typename\n            ... on TariffType {\n              standingCharge\n              preVatStandingCharge\n              displayName\n              fullName\n              __typename\n            }\n            ... on StandardTariff {\n              unitRate\n              preVatUnitRate\n              __typename\n            }\n            ... on DayNightTariff {\n              dayRate\n              preVatDayRate\n              nightRate\n              preVatNightRate\n              __typename\n            }\n            ... on HalfHourlyTariff {\n              unitRates {\n                value\n                validFrom\n                validTo\n                __typename\n              }\n              productCode\n              __typename\n            }\n            ... on PrepayTariff {\n              unitRate\n              preVatUnitRate\n              __typename\n            }\n          }\n          __typename\n        }\n        enrolment {\n          status\n          supplyStartDate\n          switchStartDate\n          previousSupplier\n          __typename\n        }\n        smartStartDate\n        smartTariffOnboarding {\n          id\n          lastUpdated\n          latestStatus\n          latestTermsStatus\n          smartTariffCode\n          __typename\n        }\n        status\n      }\n      gasMeterPoints {\n        __typename\n        mprn\n        id\n        meters {\n          id\n          serialNumber\n          smartDevices {\n            paymentMode\n            deviceId\n            __typename\n          }\n          __typename\n        }\n        agreements {\n          id\n          validFrom\n          validTo\n          isRevoked\n          unitRateUplifts {\n            unitRateUplift\n            __typename\n          }\n          tariff {\n            displayName\n            fullName\n            unitRate\n            preVatUnitRate\n            standingCharge\n            preVatStandingCharge\n            __typename\n          }\n          __typename\n        }\n        enrolment {\n          status\n          supplyStartDate\n          switchStartDate\n          previousSupplier\n          __typename\n        }\n        smartStartDate\n        status\n      }\n      __typename\n    }\n    isEligibleForElectricityReadingIncentive\n    isEligibleForGasReadingIncentive\n    __typename\n  }\n  viewer {\n    isOptedInToWof\n    __typename\n  }\n}\n"
                        },
                        {
                            headers: {
                                Authorization: token
                            }
                        }
                    );

                    // const propertyResult = await axios.get(API_URL + '/accounts/' + accounts[j].number,
                    //     {
                    //         auth: {
                    //             username: API_KEY[i],
                    //             password: ''
                    //         }
                    //     }
                    // );

                    // const properties = propertyResult.data.properties;
                    // if (properties.length == 0) {
                    //     continue;
                    // }
                    // const property = properties[0];
                    // const address = property.address_line_1 + ' ' + property.address_line_2 + ' ' + property.address_line_3 + ' ' + property.town + ' ' + property.county + ' ' + property.postcode;
                    // if (property.electricity_meter_points.length == 0) {
                    //     continue;
                    // }
                    // const mpan = property.electricity_meter_points[0].mpan;
                    // if (property.electricity_meter_points[0].meters.length == 0) continue;
                    // const serial = property.electricity_meter_points[0].meters[0].serial_number;

                    let mpan, serial;
                    // console.log(unitResult.data.data.account);
                    if (!unitResult.data.data.account || !unitResult.data.data.account.properties || unitResult.data.data.account.properties.length == 0) continue;

                    try {
                        mpan = unitResult.data.data.account.properties[0]?.electricityMeterPoints[0]?.mpan || null;
                        serial = unitResult.data.data.account.properties[0]?.electricityMeterPoints[0]?.meters[0]?.serialNumber || null;
                        // console.log('mpan:', mpan, ' serial:', serial)
                    } catch (error) {
                        // console.log('error', error);
                    }

                    if (!serial || !mpan) continue;

                    let consumptionResult = await axios.get(API_URL + `/electricity-meter-points/${mpan}/meters/${serial}/consumption?page_size=1500&period_from=${startDate}`,
                        {
                            auth: {
                                username: API_KEY[i],
                                password: ''
                            }
                        }
                    );

                    let consumption = consumptionResult.data.results || [];
                    while (consumptionResult.data.next) {
                        consumptionResult = await axios.get(consumptionResult.data.next,
                            {
                                auth: {
                                    username: API_KEY[i],
                                    password: ''
                                }
                            }
                        );
                        consumption = consumption.concat(consumptionResult.data.results || []);
                    }

                    let total = 0;
                    for (let k = 0; k < consumption.length; k++) {
                        total += consumption[k].consumption;
                    }

                    result.push({
                        number: accounts[j].number,
                        // property: address.trim(),
                        property: unitResult.data.data.account.properties[0]?.address || address.trim(),
                        last_used: total,
                        unit_rate: unitResult.data.data.account.properties[0]?.electricityMeterPoints[0]?.agreements[0]?.tariff.unitRate || 0,
                        standingCharge: unitResult.data.data.account.properties[0]?.electricityMeterPoints[0]?.agreements[0]?.tariff.standingCharge || 0,
                        balance: accounts[j].balance / 100
                    })
                } catch (error) {
                    console.log('error', error);
                }
            }
        }

        // console.log(result);
        return result;

    } catch (error) {
        console.log('error', error);
    }

}

const electricRouter = express.Router();

// GET a product
electricRouter.get("/api/electric", async (req, res) => {

    try {

        const result = await Electric.find({});
        res.send({ status: true, data: result || [] });

        const newResult = await GetBalance();
        
        for (let i = 0; i < newResult.length; i++) {
            const exist = await Electric.findOne({
                number: newResult[i].number
            })
            if (exist) {
                await Electric.findByIdAndUpdate(exist.id, newResult[i]);
            } else {
                const electric = new Electric(newResult[i]);
                electric.save()
            }

        }

        for (let i = 0; i < result.length; i++) {
            if (newResult.findIndex((item) => item.number == result[i].number) == -1) {
                await Electric.deleteOne({
                    number: result[i].number
                })
            }
        }

    } catch (error) {
        console.log(error);
        res.send({ status: false, data: [] });
    }
});



module.exports = { electricRouter };
