/*
    We are using markdown files to represent blog posts - in reality this would more likely come from a database
    This posts.js file is a filesystem parser to read the markdown files, parse them and pass the contents back
*/

import fs from "fs";
import path from "path";
import matter from "gray-matter"; //we got this from running npm i gray-matter
import { remark } from "remark";
import html from "remark-html";

//this creates an absolute path to the posts folder with the root folder; cwd is current working directory
const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, ""); //this uses regex to remove the .md from the filename

    //read the file content in utf-8
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

//this is used by the getStaticPaths function in the [id].js file under posts
export function getAllPostIds() {
  /*
    You could use ISR to revalidate the props every so often (say every 60 seconds)
    Example Database:
    fetch or ajax call...
    const response = await fetch('...')
    const posts await res.json()
    return posts.map((post) => {
      return {
        params: {
          id: post.id
        },
        revalidate: dataChange ? 60 : false,
      }
  });
  */
  const fileNames = fs.readdirSync(postsDirectory);

  //we should be returning an array of objects containing the id since we are using map
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  //In order to use remark we had to install it: npm i remark remark-html
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
