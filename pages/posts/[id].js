import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";

//postData is being generated in getStaticProps
//npm i date-fns
export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXL}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <br />
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

//next js will automatically call these functions
/* 
    See documentation: https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-paths
    
    fallback: false - means any paths not returned by getStaticPaths will result in a 404 page
*/
export async function getStaticPaths() {
  //return a list of possible values for id
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

//params comes from the getStaticprops
export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
