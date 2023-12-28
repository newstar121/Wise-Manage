import axios from 'axios'

import info from '../../service/consts'
const baseurl = `${info.SERVER_BASE}/ott?ott=`

const getBalances = async () => {

    try {
        const result = [];
        const profileResult = await axios.get(info.API_URL + 'v2/profiles',
            {
                headers: {
                    Authorization: 'Bearer ' + info.TOKEN
                }
            }
        );

        const profiles = profileResult.data || [];

        for (let i = 0; i < profiles.length; i++) {

            const profile = profiles[i];

            const profileId = profile.id;

            const balanceResult = await axios.get(info.API_URL + `v4/profiles/${profileId}/balances?types=STANDARD`,
                {
                    headers: {
                        Authorization: 'Bearer ' + info.TOKEN
                    }
                }
            );

            const balances = balanceResult.data || [];

            for (let i = 0; i < balances.length; i++) {

                const balance = balances[i];
                const balanceId = balance.id;
                const currency = balance.currency;

                result.push({
                    fullName: profile.fullName,
                    profileId: profileId,
                    balanceId: balanceId,
                    currency: currency,
                    type: balance.type,
                    // balance: balance.amount.value,
                    balance: Number(balance.amount.value).toLocaleString('en', {
                        minimumFractionDigits: 2
                    })
                });
            }

            const balanceResult1 = await axios.get(info.API_URL + `v4/profiles/${profileId}/balances?types=SAVINGS`,
                {
                    headers: {
                        Authorization: 'Bearer ' + info.TOKEN
                    }
                }
            );

            const balances1 = balanceResult1.data || [];

            for (let i = 0; i < balances1.length; i++) {

                const balance = balances1[i];
                const balanceId = balance.id;
                const currency = balance.currency;

                result.push({
                    fullName: profile.fullName,
                    profileId: profileId,
                    balanceId: balanceId,
                    currency: currency,
                    type: balance.type,
                    // balance: balance.amount.value,
                    balance: Number(balance.amount.value).toLocaleString('en', {
                        minimumFractionDigits: 2
                    })
                });
            }

        }
        return result;
    } catch (error) {
        console.log('error', error)
    }

}

export default async function handler(req, res) {
    try {
        const response = await getBalances();
        if (response === false) {
            return res.status(500).end("WiseApi Error")
        } else {
            res.status(200).json(response)
        }
    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}
