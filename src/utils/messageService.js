const axios = require("axios");

exports.sendMessagePattern = async ({ mobile, activeCode }) => {
    return axios.post("https://api2.ippanel.com/api/v1/sms/pattern/normal/send",
        JSON.stringify({
            code: "xls2y9hq6yolby9",
            sender: "+983000505",
            recipient: "+98" + mobile.substring(1),
            variable: {
                "verification-code": activeCode
            }
        }),
        {
            headers: {
                "Content-Type": "application/json",
                "apikey": process.env.MESSAGE_APIKEY,
            }
        }
    );
}