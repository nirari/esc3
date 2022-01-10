import RSS from 'rss';
import { description, returnTitle, BASE_URL } from './meta';
import { client } from '../libs/client';
import { BlogListResponse } from "../types/blog";

export const generateFeedXml = async () => {
  const feed = new RSS({
    title: returnTitle(),
    description,
    feed_url: `${BASE_URL}/feed.xml`,
    site_url: BASE_URL,
    language: 'ja',
  });

  const { contents } = await client.get<BlogListResponse>({
    endpoint: "blog",
    queries: {
      fields: "id,title,publishedAt"
    },
  });
  contents.forEach((blog) => {
    feed.item({
      title: returnTitle(blog.title),
      description: blog.description,
      date: blog.publishedAt ?? blog.createdAt,
      url: `${BASE_URL}/${blog.id}`,
    });
  });

  return feed.xml();
};

export default generateFeedXml;