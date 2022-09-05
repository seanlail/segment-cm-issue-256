import "../components/segment.css";

import { Segment } from "../components/Segment";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Segment />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
