const nodemailer = require("nodemailer");
const request = require("request");
const Base = require("./exception_handling");
const ejs = require("ejs");
const { HTTPS } = require("./https-status-codes/https-status-codes");
const {
  Users,
  VerifyOtp,
  Roles,
  Roles_Permissions,
  Permissions,
} = require("../models/index");
const { CreateNew } = require("./common/utils/dbUtils");
const { ContactType } = require("./fix_ids");

var transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  pool: true,
  auth: {
    user: "profcyma.otp@profcyma.com",
    pass: "dwcq shnh fijz hfsp",
  },
});

//harvestera
//bgso bnmj ltlc knsd

const otpmail = async ({ userEmail, otp }) => {
  await VerifyOtp.create({
    email: userEmail,
    contact_type_id: ContactType.Email,
    otp: otp,
  });

  await transporter.sendMail(
    {
      from: "profcyma.otp@profcyma.com",
      to: userEmail,
      subject: "Verify OTP",
      html: `<h1>OTP = ${otp}</h1>`,
    },
    async (err, info) => {
      if (err) {
        console.error(err);
        return false;
      } else {
        console.log(`Email sent to ${userEmail}: ${info.response}`);
        return true;
      }
    }
  );
};

const templatemultiemail = async () => {
  // Read the email template file
  // const filepath = path.join(
  //   __dirname,
  //   "../../views",
  //   "template",
  //   "template",
  //   "edit.ejs"
  // );

  // return (filepath);
  // const emailTemplate = fs.readFileSync(filepath, "utf8");

  const templatedata = await db.template.findByPk(1);

  const recipients = [
    { email: "nikhil.hirulkar@profcyma.com", name: "Nikhil Hirulkar" },
    { email: "oshin.kawale@profcyma.com", name: "Oshin Kawale" },
    // Add more recipients as needed
  ];

  for (const recipient of recipients) {
    const renderedTemplate = ejs.render(
      `<html>
        <body>
          <h4>Hello <%= recipient.name %></h4>
          <p><%= templatedata.templatetext %>.</p>
        </body>
      </html>`,
      { recipient, templatedata }
    );

    const mailOptions = {
      from: "kirankumar.falmari@profcyma.com",
      to: recipient.email,
      subject: "Your Subject Here",
      html: renderedTemplate,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${recipient.email}:`, info.response);
    } catch (error) {
      console.log(`Failed to send email to ${recipient.email}:`, error);
    }
  }
};

const mail = (useremail) => {
  transporter.sendMail(
    {
      from: "kirankumar.falmari@profcyma.com",
      to: useremail,
      subject: "Get Contact Mail Got",
      html: "<h1>This is from Mail</h1>",
    },
    (err, info) => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log(info.response);
        return;
      }
    }
  );
};

const mailDoctorsubscription = (useremail, doctorName, customerName, subscriptionName) => {
  const htmlContent = `
    <h2>Subscription Update Notification</h2>
    <p><strong>Doctor:</strong> ${doctorName} has updated their subscription.</p>
    <p><strong>Assigned To:</strong> ${customerName}</p>
    <p><strong>Subscription Plan:</strong> ${subscriptionName}</p>
    <p>This action was completed successfully and is now active in the system.</p>
  `;

  transporter.sendMail(
    {
      from: "kirankumar.falmari@profcyma.com",
      to: useremail, // admin email here
      subject: "Doctor Subscription Updated & Assigned",
      html: htmlContent,
    },
    (err, info) => {
      if (err) {
        console.error("Email send error:", err);
        return;
      } else {
        console.log("Email sent successfully:", info.response);
        return;
      }
    }
  );
};


const mailSubscription = (userEmail, plan, planPrice, userName = "Customer") => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hi ${userName},</h2>
      <p>Thank you for purchasing a subscription with us!</p>
      <p><strong>Plan:</strong> ${plan?.name}</p>
      <p><strong>Price:</strong> ₹${planPrice?.price}</p>
      <p>We hope you enjoy your subscription benefits. If you have any questions, feel free to contact our support team.</p>
      <br/>
      <p>Best regards,<br/>UrbanPrime Team</p>
    </div>
  `;

  transporter.sendMail(
    {
      from: "kirankumar.falmari@profcyma.com",
      to: userEmail,
      subject: "Subscription Purchase Confirmation",
      html: htmlContent,
    },
    (err, info) => {
      if (err) {
        console.error("Error sending subscription email:", err);
      } else {
        console.log("Subscription email sent:", info.response);
      }
    }
  );
};


const mobileotp = async ({ mobile, otp, res }) => {
  try {
    if (!mobile) {
      console.log("mobile number is required");
      return;
    }

    const data = {
      contact_no: mobile,
      contact_type_id: ContactType.Phone,
      otp: otp,
    };


    const data1 = await VerifyOtp.create(data);

    // await CreateNew(VerifyOtp, data);

    const url = `http://sms.orcainfosolutions.com/api/mt/SendSMS?user=profcyma&password=password1&senderid=PROGBL&channel=Trans&DCS=0&flashsms=0&number=${mobile}&text=Dear%20Customer,%20Your%20OTP%20for%20registration%20is%20${otp}.%20Use%20this%20OTP%20to%20register.%20Team%20Profcyma%20Demo&route=13&PEId=1201168896800164072`;

    // const url = `http://sms.orcainfosolutions.com/api/mt/SendSMS?user=profcyma&password=password1&senderid=PROGBL&channel=Trans&DCS=0&flashsms=0&number=91${mobile}&text=Dear%20Customer,%20Your%20OTP%20for%20registration%20is%20${otp}.%20Use%20this%20OTP%20to%20register.%20Team%20Profcyma%20Demo&route=13&PEId=1201168896800164072`;
    // Send OTP via SMS
    request(url, function (error, response, body) {
      if (error) throw new Error(error);
      else {
        console.log("OTP sent successfully");
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(Base.sendError("Internal server error"));
  }
};

const stockMail = async ({ product_name, qty }) => {
  try {
    // Fetch the admin user from the database
    const admin = await db.users.findOne({ where: { id: 1 } });

    const renderedTemplate = ejs.render(
      `<html>
        <body>
          <h4>Hello <%= admin.name %></h4>
          <p><%= product_name %> is getting out of stock, only <%= qty %> remains.</p>
        </body>
      </html>`,
      { admin, product_name, qty }
    );

    // Send the email
    const info = await transporter.sendMail({
      from: "profcyma.otp@profcyma.com",
      to: admin?.email,
      subject: "Stock Alert: Product Running Low",
      html: renderedTemplate,
    });

    console.log(`Email sent to ${admin.email}: ${info.response}`);
    return true; // Indicate success
  } catch (err) {
    console.error("Error sending email:", err);
    return false; // Indicate failure
  }
};

const StoreStatusMail = (useremail, subject, message) => {
  if (!useremail) {
    console.error("No email address provided");
    return; // Exit if no email is provided
  }

  transporter.sendMail(
    {
      from: "ankur.jain@profcyma.com",
      to: useremail, // This is where the recipient's email address is set
      subject: subject,
      html: `<h1>${message}</h1>`,
    },
    (err, info) => {
      if (err) {
        console.error("Error:", err);
        return;
      } else {
        console.log("Email sent:", info.response);
        return;
      }
    }
  );
};

const sendMail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.log("Error occurred while sending email:", error);
  }
};

const DBRegistration = (useremail) => {
  transporter.sendMail(
    {
      from: "ankur.jain@profcyma.com",
      to: useremail, // This is where the recipient's email address is set
      subject: "Delivery Boy Registration Request",
      html: `<b>Thank You for Showing Interest!</b>
        <p>We have received your request to become a Delivery Partner with the Moon.</p>
        <br>Please wait while your request is being reviewed and approved.
        <br>
        <h3>We Wish You All the Best!</h3>
        <br>
        <br>Thanks and Regards,
        <br>The Moon`,
    },
    (err, info) => {
      if (err) {
        console.error("Error:", err);
        return;
      } else {
        console.log("Email sent:", info.response);
        return;
      }
    }
  );
};

const mailOrder = (adminEmail, orderId, customerName, orderTotal) => {
  const htmlContent = `
    <h2>New Order Received</h2>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Customer Name:</strong> ${customerName}</p>
    <p><strong>Total Amount:</strong> ₹${orderTotal}</p>
    <p>Please login to the admin panel to review and process the order.</p>
  `;

  transporter.sendMail(
    {
      from: "kirankumar.falmari@profcyma.com",
      to: adminEmail,
      subject: "New Order Received",
      html: htmlContent,
    },
    (err, info) => {
      if (err) {
        console.error("Failed to send new order email:", err);
      } else {
        console.log("New order email sent:", info.response);
      }
    }
  );
};



const mailAppointment = (adminEmail, date, customerName, doctorname) => {
  const htmlContent = `
    <h2>New Appointment Request</h2>
    
    <p><strong>Customer Name:</strong> ${customerName}</p>
    <p><strong>Doctor Name:</strong> ${doctorname}</p>
    <p><strong>Scheduled For:</strong> ${date}</p>
    <p>Please review and approve the appointment in the admin panel.</p>
  `;

  transporter.sendMail(
    {
      from: "kirankumar.falmari@profcyma.com",
      to: adminEmail,
      subject: "New Appointment Request – Approval Needed",
      html: htmlContent,
    },
    (err, info) => {
      if (err) {
        console.error("Failed to send appointment email:", err);
      } else {
        console.log("Appointment notification email sent:", info.response);
      }
    }
  );
};

const mailNewUser = (userData, adminEmail) => {


  const htmlContent = `
    <h2>New User Registered</h2>
    <p><strong>Name:</strong> ${userData.name}</p>
    <p><strong>Email:</strong> ${userData.email}</p>
   
    <p><strong>Registered At:</strong> ${new Date().toLocaleString()}</p>
  `;

  transporter.sendMail(
    {
      from: "kirankumar.falmari@profcyma.com",
      to: adminEmail,
      subject: "New User Created",
      html: htmlContent,
    },
    (err, info) => {
      if (err) {
        console.error("Failed to send admin notification:", err);
      } else {
        console.log("Admin notified:", info.response);
      }
    }
  );
};


const commonMail = (userEmail, subject, message) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: "kirankumar.falmari@profcyma.com",
        to: userEmail,
        subject: subject || "Purchase Order Notification",
        html: message || "<h1>No content</h1>",
      },
      (err, info) => {
        if (err) {
          console.error("Mail Error:", err);
          reject(err);
        } else {
          console.log("Mail sent:", info.response);
          resolve(info);
        }
      }
    );
  });

  
};



module.exports = {
  otpmail,
  mail,
  templatemultiemail,
  mobileotp,
  stockMail,
  StoreStatusMail,
  sendMail,
  DBRegistration,
  mailSubscription,
  mailDoctorsubscription,
  mailOrder, mailAppointment,
  mailNewUser,
  commonMail
};
