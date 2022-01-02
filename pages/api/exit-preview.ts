import { NextApiRequest, NextApiResponse } from "next";

import { BlogResponse } from "../../types/blog";
import { client } from "../../libs/client";
import { toStringId } from "../../utils/toStringId";

const exitPreview = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const id = toStringId(req.query.id);

  res.clearPreviewData();

  try {
    const post = await client.get<BlogResponse>({
      endpoint: "blog",
      contentId: id,
      queries: { fields: "id" },
    });


  res.writeHead(307, { Location: post ? `/blog/${post.id}` : "/" });
  } catch {
    // 対象記事が下書きで公開されていない場合、ホームに戻す
    res.writeHead(307, { Location: "/" });
  }
  
  res.end();
};

export default exitPreview;
