import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Mali:ital,wght@0,200;0,300;0,500;0,600;0,700;1,200;1,300;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <title key={"title"}>Quizzzz</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
