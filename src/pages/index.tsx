import Head from "next/head";
import { GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import api from "../services/api";

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
  const { data } = await api.get("episodes?_limit=12&_sort=published_at&_order=desc", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc"
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      description: episode.description,
      url: episode.file.url,
    }
  });

  return {
    props: {
      episodes: data,
    },
    revalidate: 120 * 8,
  };
}