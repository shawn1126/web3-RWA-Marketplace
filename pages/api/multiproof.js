import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
const { readFileSync } = require("fs");
var path = require("path");

export default function handler(req, res) {
  const { t1, t2 } = req.body;
  console.log("t1", t1, "t2", t2);
  const configDirectory = path.resolve(process.cwd(), "pages", "api");
  const file = readFileSync(
    path.join(configDirectory, "multiTree.json"),
    "utf8"
  );

  const tree2 = StandardMerkleTree.load(JSON.parse(file));
  let earthProof;
  let oceanProof;

  try {
    earthProof = tree2.getProof([t1, "0x4561727468"]);
    oceanProof = tree2.getProof([t2, "0x4f6365616e"]);
    console.log(tree2.root);
  } catch (e) {
    console.log("proof2failed", e);
  }
  res.status(200).json({ earthProof, oceanProof, root: tree2.root });
}
