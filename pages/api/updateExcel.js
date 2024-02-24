import axios from "axios";
export default async function handler(req, res) {
    try {
        const { address, promo, mintNum, cuurentDateTime, production} = req.body;

        let ProdURL="https://script.google.com/macros/s/AKfycbwk0NmaVa3CgZ1UQYTnlPiAj--Eh8jxh63XesBAbttT2RGquYUh67ogHY7ypzL1W1Ec/exec";

        let TestURL="https://script.google.com/macros/s/AKfycbzLuwU0mfOtPmURXRUBMgpLoF4dmhopZjOlvADRbeE8BbX-hIdmjqe2Q1i0GELyAWva/exec";

        await axios.post(
          production ? ProdURL : TestURL,
          null, 
          {
            params: {
              userAddress: address,
              kolQRcode: promo,
              nftType: "Amwaji20",
              mintTime: cuurentDateTime,
              mintNumber: mintNum,
            },
          }
        );
res.status(201).json({ message: "Success" });
      } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Something went wrong" });
      }
  
}
