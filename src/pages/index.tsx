import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
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
                  <Image
                    width={192}
                    height={192}
                    objectFit="cover" 
                    src={episode.thumbnail} 
                  />

                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
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
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>PodCast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
          {
            allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td>
                    <img src={episode.thumbnail} />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                    <a href="">{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" />
                    </button>
                  </td>
                </tr>
                )
              })
            }
          </tbody>
        </table>
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