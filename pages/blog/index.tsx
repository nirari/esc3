import React from "react";

import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Link from "next/link";
import { BlogListResponse } from "../../types/blog";
import { SiteDataResponse } from "../../types/siteData";
import { client } from "../../libs/client";

import utilStyles from '../../styles/utils.module.css'
import Date from '../../components/date'
import Head from 'next/head'

type StaticProps = {
  siteData: SiteDataResponse;
  blogList: BlogListResponse;
};
type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const Page: NextPage<PageProps> = (props) => {
  const { siteData, blogList } = props;
return (
    <div className={utilStyles.container}>
    <Head>
      <title>Blog | {siteData.blogTitle}</title>
    </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {blogList.contents.map((blog: { id, publishedAt, title }) => {
              return (<li className={utilStyles.listItem} key={blog.id}>
                  <Link href={`/blog/${blog.id}`}>
                      <a>{blog.title}</a>
                  </Link>
                  <br />
                  <small className={utilStyles.lightText}>
                    <Date dateString={blog.publishedAt} />
                  </small>
              </li>);
          })}
        </ul>
      </section>
      <Link href="/">
        <a>← Back to Home</a>
      </Link>

    </div>
  );
};


export const getStaticProps: GetStaticProps = async () => {
  const siteDataPromise = client.get<SiteDataResponse>({
    endpoint: "sitedata",
    queries: { fields: "blogTitle" },
  });

  const blogListPromise = client.get<BlogListResponse>({
    endpoint: "blog",
    queries: { fields: "id,title,publishedAt" },
  });

  const [siteData, blogList] = await Promise.all([
    siteDataPromise,
    blogListPromise,
  ]);

  return {
    props: {
      siteData,
      blogList,
    },
    revalidate: 60,
  };
};

export default Page;
