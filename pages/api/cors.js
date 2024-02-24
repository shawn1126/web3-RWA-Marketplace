import fetch from "isomorphic-unfetch";  //used for SSR

const Cors = async (req, res) => {
  const { url } = req.query;
  console.log("req url",url)
  console.log("req.body",req.body)
  console.log("req.method",req.method)
  console.log("req.header",req.headers)

  // 物件經過headers會變小寫所以是req.headers['content-type']，不是Content-Type(印出req.headers可知)
  // 直接用上一層fetch的req.headers去fetch會出現ＳＳＬ錯誤
  /* default config */
  let header = {
    'Content-Type': 'application/json'
  }
  /* default config */

  /* 過濾出是gofact的fetch，加上api key */
  if (req.headers['gofact-api-token'] !== undefined) {
    header['GOFACT-API-TOKEN'] = req.headers['gofact-api-token']
  }
  /* 過濾出是gofact的fetch，加上api key */

  try {
    const resProxy = await fetch(url
      , {
        method: req.method,
        headers: header,
        body: JSON.stringify(req.body),
        redirect: 'follow'
      }
    );
    console.log("proxy",resProxy)
    res.status(200).send(resProxy.body);
  } catch (error) {
    res.status(400).send(error.toString());
  }
};

export default Cors;


