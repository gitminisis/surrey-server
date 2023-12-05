import { NextRequest, NextResponse } from 'next/server';
const BASE_DIRECTORY = process.env.BASE_DIRECTORY;
import cheerio from 'cheerio';
import { promises as fs } from 'fs';
import path from 'path';
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const config = {
      directory: 'C:/Mike/nixon/nixon.html',
      elements: ['div'],
    };
    const filePath = path.normalize(config.directory);

    const file = await fs.readFile(filePath, 'utf-8');
    const $ = cheerio.load(file); // cheerio to scrape the page

    //

    // loop through elements to find data-edit
    // put the elements in a list

    // const data = [];
    // config.elements.forEach((selector) => {
    //   const content = $(selector).text();
    //   data.push(content);
    // });

    // // const content = JSON.parse(file);
    // // const content = fi

    // return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // const config = {
    //   directory: 'C:/Mike/nixon/nixon.html',
    //   elements: ['#haha', '#hoho', '#hihi'],
    // };
    const filePath = path.normalize(config.directory);

    const file = await fs.readFile(filePath, 'utf-8');
    const $ = cheerio.load(file);
    // get all the element that has this special value
    // const array = list of all the on with data-nxion

    const data = ['test', 'test'];

    // config.elements.forEach((selector) => {
    //   const content = $(selector).text();
    //   data.push(content);
    // });

    // const content = JSON.parse(file);
    // const content = fi

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
