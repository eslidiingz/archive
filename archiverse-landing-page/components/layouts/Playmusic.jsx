import Player from "../player/index";
import "@madzadev/audio-player/dist/index.css";


function Playmusic() {
  const tracks = [
    {
      url: "https://audioplayer.madza.dev/Madza-Chords_of_Life.mp3",
      coverimg: "http://res.cloudinary.com/alick/image/upload/v1502689731/Despacito_uvolhp.jpg",
      title: "Madza - Chords of Life",
      tags: ["house"],
    },
    {
      url: "https://audioplayer.madza.dev/Madza-Late_Night_Drive.mp3",
      coverimg: "http://res.cloudinary.com/alick/image/upload/v1502689731/Despacito_uvolhp.jpg",
      title: "Madza - Late Night Drive",
      tags: ["dnb"],
    },
    {
      url: "https://audioplayer.madza.dev/Madza-Persistence.mp3",
      coverimg: "http://res.cloudinary.com/alick/image/upload/v1502689731/Despacito_uvolhp.jpg",
      title: "Madza - Persistence",
      tags: ["dubstep"],
    },
  ];
  
    return (
      <>
      
      {/* <Player
        trackList={tracks}
        includeTags={false}
        includeSearch={false}
        showPlaylist={false}
        autoPlayNextTrack={false}
      /> */}

      </>
    )
  }
  export default Playmusic