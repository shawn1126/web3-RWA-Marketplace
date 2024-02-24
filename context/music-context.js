import { createContext, useState, useEffect } from "react";

const MusicContext = createContext({ isMusicOn: true, setIsMusicOn: () => {} });
const { Provider } = MusicContext;

const MusicProvider = ({ children }) => {
  const [isMusicOn, setIsMusicOn] = useState(true);

  const obj = {
    isMusicOn,
    setIsMusicOn: (val) => setIsMusicOn(val),
  };
  useEffect(() => {
    if (isMusicOn) document.getElementById("audio")?.play();
    else document.getElementById("audio")?.pause();
    if (document.getElementById("audio")?.paused && isMusicOn)
      document.getElementById("audio")?.play();
    if (document.getElementById("audio").volume)
      document.getElementById("audio").volume = 0.2;
    return () => {
      document.getElementById("audio")?.pause();
    };
  }, [isMusicOn]);

  return (
    <Provider value={obj}>
      <>
        <audio
          loop={true}
          autostart="true"
          id="audio"
          src="/bgmusic.mp3"
        ></audio>
        {children}
      </>
    </Provider>
  );
};

export { MusicContext, MusicProvider };
