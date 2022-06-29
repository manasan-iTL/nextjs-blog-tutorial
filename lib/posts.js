import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts')

export const getSortedPostData = () => {
    //Get the file name under posts
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostData = fileNames.map(fileName => {
        // remove .md
        const id = fileName.replace(/\.md$/, '')

        //Read Markdown file as string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf-8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // conbine the data with the id mapの戻り値
        return {
            id,
            ...matterResult.data
        }
    })

    //sort posts by date
    return allPostData.sort(({data: a}, {data: b}) => {
        if (a < b) {
            return 1;
          } else if (a > b) {
            return -1;
          } else {
            return 0;
          }
    })
}

export const getAllPostIds = () => {
    const fileNames = fs.readdirSync(postsDirectory)
      // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]

  return fileNames.map(fileName => {
    return {
        params: {
            id: fileName.replace(/\.md$/, ''),
        }
    }
  })
}

export const getPostData = async(id) => {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
    const contentHtml = processedContent.toString();
  
    // Combine the data with the id
    return {
      id,
      contentHtml,
      ...matterResult.data,
    };
  }