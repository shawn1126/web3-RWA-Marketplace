import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
const { readFileSync } = require("fs");
var path = require("path");

export default function handler(req, res) {
  const { address } = req.body;
  const configDirectory = path.resolve(process.cwd(), "pages", "api");
  const file = readFileSync(
    path.join(configDirectory, "whitelist.json"),
    "utf8"
  );
  const tree = StandardMerkleTree.load(JSON.parse(file));
  let proof;
  for (const [i, v] of tree.entries()) {
    if (v[0] === address) {
      proof = tree.getProof(i);
    }
  }

  res.status(200).json({ proof, root: tree.root });
}
