import React from "react";

import {
  NextPage,
  GetStaticPaths,
  InferGetStaticPropsType,
  GetStaticProps,
} from "next";

import Link from "next/link";
import { useRouter } from "next/router";

import { BlogResponse } from "../../types/blog";
import { client } from "../../libs/client";
import { isDraft } from "../../utils/isDraft";
import { toStringId } from "../../utils/toStringId";

import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import Date from '../../components/date';

type StaticProps = {
  blog: BlogResponse;
  draftKey?: string;
};
type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const Page: NextPage<PageProps> = (props) => {
  const { blog, draftKey } = props;
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {draftKey && (
        <div>
          現在プレビューモードで閲覧中です。
          <Link href={`/api/exit-preview?id=${blog.id}`}>
            <a>プレビューを解除</a>
          </Link>
        </div>
      )}
        <Head>
          <title>{blog.title} | Blog</title>
        </Head>
        <div className={utilStyles.container}>
        <header>
          <h1 className={utilStyles.headingXl}>{blog.title}</h1>
          <div className={utilStyles.lightText}>
            <Date dateString={blog.publishedAt} />
          </div>
            {blog.tags && blog.tags.length > 0 && (
              <div>
                <ul className={utilStyles.list}>
                  {blog.tags.map((tag) => (
                    <li className={utilStyles.tagList} key={tag.id}>
                      <Link href={`/tags/${tag.id}`}>{tag.tagName}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </header>
        {blog.body && (
          <article className={utilStyles.headingMd} dangerouslySetInnerHTML={{ __html: blog.body }} />
        )}
        <div>
            <Link href="/blog/">
                <a>← Blog Top</a>
            </Link>
         </div>
        </div>
 
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: "blocking",
    paths: [],
  };
};

export const getStaticProps: GetStaticProps<StaticProps> = async (context) => {
  const { params, previewData } = context;
  if (!params?.id) {
    throw new Error("Error: ID not found");
  }

  const id = toStringId(params.id);
  const draftKey = isDraft(previewData)
    ? { draftKey: previewData.draftKey }
    : {};

  try {
    const blog = await client.get<BlogResponse>({
      endpoint: "blog",
      contentId: id,
      queries: {
        fields: "id,title,body,publishedAt,tags",
        ...draftKey,
      },
    });

    return {
      props: { blog, ...draftKey },
      revalidate: 60,
    };
  } catch (e) {
    return { notFound: true };
  }
};

export default Page;