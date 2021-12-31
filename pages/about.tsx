import React from "react";

import {
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useRouter } from "next/dist/client/router";
import { SiteDataResponse } from "../types/siteData";
import { client } from "../libs/client";
import utilStyles from '../styles/utils.module.css';
import Head from 'next/head'

type StaticProps = {
    siteData: SiteDataResponse;
  };
type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const Page: NextPage<PageProps> = (props) => {
  const { siteData } = props;
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <main>
    <Head>
      <title>About | {siteData.blogTitle}</title>
    </Head>

    <div className={utilStyles.container}>
      <h1>About</h1>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>

        {siteData.about && (
          <article className={utilStyles.headingMd} dangerouslySetInnerHTML={{ __html: siteData.about }} />
        )}
      </section>

    </div>
    </main>
  );
};


export const getStaticProps: GetStaticProps<StaticProps> = async (context) => {
  const { params } = context;
  const siteData = await client.get<SiteDataResponse>({
      endpoint: "sitedata",
      queries: {
        fields: "blogTitle,about",
      },
    });
    return {
      props: { siteData },
      revalidate: 60,
    };
};

export default Page;
