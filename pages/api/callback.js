import { createUser } from "../../src/utils/storeFirebase";
import { getUserByid } from "../../src/utils/storeFirebase";
const sgMail = require("@sendgrid/mail");

export default async function handler(req, res) {
  if (req.method === "POST" && req.body.idv_task_id !== undefined) {


    try {
      await createUser(req.body.idv_task_id, req.body);

      if (req.body.audit_status !== undefined) {
        let {inputEmail:email,language} = await getUserByid(req.body.idv_task_id);
        if(!language)language="en";

        sgMail.setApiKey(
          "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"
        ); //kyc2
        console.log("Audit status is", req.body.audit_status);
        console.log("sgMail",sgMail)
        let msg;
        if (req.body.audit_status == "Pending") {
          msg = {
            to: email,
            from: "InVaria <info@invar.finance>",
            template_id:
              language === "en"
                ? "d-c4a4395b54894d87ab1e70fc77a9a407"
                : "d-d85f7f1153f74446a415bbd80853e335",
          };
        } else if (req.body.audit_status == "Rejected") {
          msg = {
            to: email,
            from: "InVaria <info@invar.finance>",
            template_id:
              language === "en"
                ? "d-8eb49847b6fc464cab625773f40ec47c"
                : "d-08b01406fdd24979ba9d0bc09bf0ca45",
          };
        } else if (req.body.audit_status == "Accepted") {
          msg = {
            to: email,
            from: "InVaria <info@invar.finance>",
            template_id:
              language === "en"
                ? "d-0e8a12f004584e8f84b4e719a803f0eb"
                : "d-7c31807442624ac9b19cecac4fb9b71e",
          };
        }
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
            res.status(201).json("created");
          })
          .catch((error) => {
            console.error(error);
            res.status(417).json("err");
          });
      }
      // res.status(201).json("created")
    } catch (error) {
      res.status(417).json(error);
    }
  } else if (req.method === "GET") {
    const {inputEmail:email} = await getUserByid("11776");
    console.log("email", email);
    sgMail.setApiKey(
      "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"
    ); //kyc2
    let msg;
    // if (state == "Unverified") {
    msg = {
      to: email,
      from: "testInvar <info@invar.finance>",
      template_id: "d-7bada9fb5a804af993d7c2f7150932f0",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    // }
    res.status(200).json("This is a response for GET. Try to POST.");
  }
}
