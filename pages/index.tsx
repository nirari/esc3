import React from "react";

import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Link from "next/link";
import { BlogListResponse } from "../types/blog";
import { SiteDataResponse } from "../types/siteData";
import { client } from "../libs/client";
import Image from 'next/image'
import utilStyles from '../styles/utils.module.css'
import Date from '../components/date'
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
        <title>{siteData.blogTitle}</title>
    </Head>
    <header className={utilStyles.header}>
        <Image
          priority
          src="/images/profile.jpg"
          className={utilStyles.borderCircle}
          height={144}
          width={144}
          alt="chidori ninokura"
        />
        <h1 className={utilStyles.heading2Xl}>{siteData.blogTitle}</h1>
      <section className={utilStyles.headingMd}>
        <p>{siteData.siteDescription}</p>
      </section>
      </header>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>最近の投稿</h2>
           
        <ul className={utilStyles.list}>
            {blogList.contents.map((blog: { id, publishedAt, title }) => {
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
    
        <small><Link href="/blog">
            <a>→ 記事一覧へ</a>
        </Link></small>

      </section>
  </div>
);
};

export const getStaticProps: GetStaticProps = async () => {
  const siteDataPromise = client.get<SiteDataResponse>({
    endpoint: "sitedata",
    queries: { fields: "blogTitle,siteDescription" },
  });

  const blogListPromise = client.get<BlogListResponse>({
    endpoint: "blog",
    queries: { limit:3, fields: "id,title,publishedAt" },
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
