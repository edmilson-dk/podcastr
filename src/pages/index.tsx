import Head from "next/head";
import { GetStaticProps } from "next";

type Episode = {
  id: string;
  title: string;
  members: string;
}

type HomeProps = {
  episodes: Episode[];
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <Head>
        <title>Podcastr - Home</title>
      </Head>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch("http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc");
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 120 * 8,
  };
}