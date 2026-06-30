import transporter from "../services/emailService.js";

    const generateOTPEmail = (otp) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto;">
        <h2>Email Verification</h2>

        <p>Hello,</p>

        <p>Your One-Time Password is:</p>

        <div style="
            font-size:32px;
            font-weight:bold;
            background:#2563eb;
            color:white;
            padding:15px;
            border-radius:10px;
            text-align:center;
            letter-spacing:8px;
        ">
            ${otp}
        </div>

        <p>This OTP expires in <b>5 minutes</b>.</p>

        <p>If you didn't request this, please ignore this email.</p>

        <hr>

        <small>Employee Management System</small>
    </div>
    `;
};


const sendEmail = (to,subject,text,html) =>{

    try{
         const info = transporter.sendMail({
        from: `workFlow <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    })
    return{
        success: true,
        message: "Email sent successfully"
    }
    }
   catch(err){
    return{
        success: false,
        error:err
    }
   }
    
   
}
export {sendEmail , generateOTPEmail}
