import fetch from "isomorphic-unfetch";  //used for SSR
import { createUser } from "../../src/utils/storeFirebase";

export const handleKyc = async (formdata) => {
  const { selectIDtype, selectCountryRegion, inputName, selectDate, inputIDnumber,language } = formdata
  let kycURL
  let origin = window.location.origin
  let originString = origin.toString()
  const data = JSON.stringify({
    "id_type": selectIDtype,
    "locale": "en",
    "workflow_id": 200,
    "success_url": originString + "/dashboard",
    "error_url": originString,
    "country": selectCountryRegion,
    "expected_name": inputName,
    "expected_birthday": selectDate,
    "expected_id_number": inputIDnumber,
    "callback_url": originString + "/api/callback",
    "customer_reference": "000000123",
    "auto_create_dd_task": false,
    "dd_task_callback_url": originString + "/api/callback",
    "language":language
  });

  try {
    const resData = await fetch("/api/cors?url=https://external-api.kryptogo.com/idv/init"
      , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'GOFACT-API-TOKEN': process.env.NEXT_PUBLIC_GOFACT_API_TOKEN,
        },
        body: data
      }
    );

    const resText = await resData.text();  //.text()!==.toString(), .text() invokes body text.
    console.log("testdomain:", window.location.href)
    // console.log("req body data:", data)
    console.log("test1resDATA:",resData)
    console.log("test1resTEXT:", resText)
    console.log("test1lastresTEXTJSON:", JSON.parse(resText))
    // console.log("resDATAJSON:", JSON.parse(resData))   //fail

    const resJSON = JSON.parse(resText)
    await createUser(resJSON.idv_task_id, resJSON)
    await createUser(resJSON.idv_task_id, formdata)

    kycURL = resJSON.url
    console.log("emailTesturl",kycURL)

  } catch (error) {
    console.log(error);
    return error
  }
  return kycURL
};