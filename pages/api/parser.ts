// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Parser from "tree-sitter";
//@ts-ignore
import Solidity from "tree-sitter-solidity";

type Data = {
  tree: any
}

const parser = new Parser();
parser.setLanguage(Solidity);

export default async function parserFunction(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { text } = req.body

  try {
  let tree = parser.parse(text);

  res.status(200).json({
    tree: tree
  });
  } catch (_){
    console.log("error parsing")
  }
}