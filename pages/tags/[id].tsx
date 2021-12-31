import React from "react";

import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";

import { ListContentsResponse } from "../../types/api";
import { BlogResponse } from "../../types/blog";

import { client } from "../../libs/client";
import { toStringId } from "../../utils/toStringId";

import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import Date from '../../components/date';

type StaticProps = {
  blogList: ListContentsResponse<BlogResponse>;
};
type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const Page: NextPage<PageProps> = (props) => {
  const { blogList } = props;
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <main>
    <Head>
      <title>Blog</title>
    </Head>
    <div className={utilStyles.container}>
      <h1>記事一覧</h1>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
      <ul className={utilStyles.list}>
        {blogList.contents.map((blog) => {
            return (
              <li className={utilStyles.listItem} key={blog.id}>
                <Link href={`/blog/${blog.id}`}>
                  <a>{blog.title}</a>
                </Link>
                <br />
                <small className={utilStyles.lightText}>
                  <Date dateString={blog.publishedAt} />
                </small>
              </li>
            );
        })}
      </ul>
      </section>
      <Link href="/blog">
        <a>← Blog Top</a>
      </Link>

    </div>
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: "blocking",
    paths: [],
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;

  if (!params?.id) {
    throw new Error("Error: ID not found");
  }

  const id = toStringId(params.id);

  try {
    const blogList = await client.get<BlogResponse>({
      endpoint: "blog",
      queries: {
        fields: "id,title,publishedAt",
        filters: `tags[contains]${id}`,
      },
    });
    return {
      props: { blogList },
      revalidate: 60,
    };
  } catch (e) {
    return { notFound: true };
  }
};

export default Page;
