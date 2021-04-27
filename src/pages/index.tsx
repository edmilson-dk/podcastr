import Head from "next/head";
import Image from "next/image"
import { GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import api from "../services/api";
import { formatAudioDurationToString } from "../utils/formatAudioDurationToString";

import styles from "../styles/home.module.scss";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  duration: number;
  durationAsString: string;
  url: string
  publishedAt: string;
  members: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <main className={styles.homePage}>
      <Head>
        <title>Podcastr - Home</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {
            latestEpisodes.map(episode => {
              return (
                <li key={episode.id}>
                  <img  
                    src={episode.thumbnail} 
 
                  />

                  <div className={styles.episodeDetails}>
                    <a href="">{episode.duration}</a>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button type="button">
                    <img src="/play-green.svg" />
                  </button>
                </li>
              )
            })
          }
        </ul>
      </section>

      <section className={styles.allEpisodes}>

      </section>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
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
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: formatAudioDurationToString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 3600 * 8,
  };
}