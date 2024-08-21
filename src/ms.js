import twilio from 'twilio';
export const Sms2 = (num, msg) =>
{
    const TWILIO_SID='AC9d2ad61dde45cd3b65267f21a8d40217'
const TWILIO_AUTH_TOKEN='49a4ae7c71c2779803a5e41bca1cfab2'
const TWILIO_FROM_NUMBER='+18135279272'
const TO_NUMBER=num
const accountsid = TWILIO_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = twilio(accountsid, authToken);


const sendSMS = async (body) => {
    const msgOptions = {
        from: TWILIO_FROM_NUMBER,
        to: TO_NUMBER,
        body:"OTP Verification"+body,
    };

    try {
        const message = await client.messages.create(msgOptions);
        console.log(message);
    } catch (err) {
        console.log(err);
    }
    
};
sendSMS(msg);


}

