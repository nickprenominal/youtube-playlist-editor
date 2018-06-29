import React, {Component} from "react";
import {buildApiRequest, executeRequest} from "../utils/gapi";
import "./Videos.css";

/**
 * Display the list of videos for a playlist.
 */
class Videos extends Component {

    constructor(props) {
        super(props);
        console.log("Videos.constructor", props);
        this.state = {
            isAuthorized: false,
            playlistId: props.match.params.playlistid,
            videos: null
        };
    }

    static getDerivedStateFromProps(props, state) {
        console.log("Videos.getDerivedStateFromProps", props);
        if (props.isAuthorized !== state.isAuthorized) {
            return {
                isAuthorized: props.isAuthorized
            };
        }

        // No state update necessary
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("Videos.componentDidUpdate");
        // At this point, we're in the "commit" phase, so it's safe to load the new data.
        if (this.state.isAuthorized && this.state.playlistId && this.state.videos === null) {
            // !!! only retrieve data if state.playlists is empty; otherwise this will generate an endless loop.
            this.retrieve();
        }
    }

    store = (data, currentToken) => {

        console.log("Videos.store", data.items, currentToken);

        if (!data) return;

        let list = data.items;
        list.sort(
            function(a, b) {
                return (a.snippet.title.toLowerCase() > b.snippet.title.toLowerCase()) ? 1 : ((b.snippet.title.toLowerCase() > a.snippet.title.toLowerCase()) ? -1 : 0);
            }
        );

        if (currentToken === undefined || !currentToken) {
            console.log("Videos.store: set new videos list");
            this.setState({videos: list});
        } else {
            console.log("Videos.store: append videos to current list");
            this.setState(prevState => ({
                videos: [...prevState.videos, ...list]
                // videos: prevState.videos.concat(list)
            }))
        }

        if (data.nextPageToken) {
            console.log('Videos.store: get next page with token ' + data.nextPageToken);
            this.retrieve(data.nextPageToken);
        }

/*
        for(item of data.items) {
            // console.log(item);
            playlistItems.push({
                id: item.id,
                title: item.snippet.title,
                description: item.snippet.description,
                videoId: item.snippet.resourceId.videoId
            });
        }

        playlistItems.sort(
            function(a, b) {
                return (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0);
            }
        );
*/
    };

    retrieve = (nextPageToken) => {
        console.log("Videos.retrieve", this.state.playlistId, nextPageToken);
        let request = buildApiRequest(
            this.state.google_api,
            'GET',
            '/youtube/v3/playlistItems',
            {
                'maxResults': '50',
                'part': 'snippet,contentDetails',
                'playlistId': this.state.playlistId,
                'pageToken': nextPageToken
            });
        executeRequest(request, (data) => this.store(data, nextPageToken));
    };


    componentDidMount() {
        console.log("Videos.componentDidMount");
        this.retrieve();
    }

    render() {

        const { isAuthorized, videos } = this.state;

        console.log("Videos.render", videos);

        if (!isAuthorized) {
            return <div></div>
        } else {
            if (videos) {
                return (
                    <div>
                        <h2>list of videos</h2>
                        <h3>{videos.length} videos</h3>
                        <div>
                            {
                                videos.map((video, index) => {
                                    return <div key={index}>{video.snippet.title}</div>
                                })
                            }
                        </div>
                    </div>
                )
            } else {
                return <div>Retrieving the list of videos...</div>
            }
        }
    }

    /*
{
  "kind": "youtube#playlistItem",
  "etag": "\"DuHzAJ-eQIiCIp7p4ldoVcVAOeY/1tCBTp6eGaB5-FomghShvhm_Vkc\"",
  "id": "UExfeDhNcFV5cHhlYlBlX1hZeWpKTUo1WVdlOTcyaU9Uci4yODlGNEE0NkRGMEEzMEQy",
  "snippet": {
    "publishedAt": "2018-06-19T10:55:25.000Z",
    "channelId": "UCE0q36_agQAeb4G3PXivkew",
    "title": "Urfaust - The Constellatory Practice (Full Album)",
    "description": "Country: The Netherlands | Year: 2018 | Genre: Atmospheric Doom/Black Metal\n\nLP & CD available here:\nhttp://www.van-records.de\n\nDigital Album available here:\nhttps://urfaust.bandcamp.com/album/the-constellatory-practice-2\n\n- Urfaust -\nWebshop: http://www.urfaust.bigcartel.com\nFacebook: https://www.facebook.com/urfaustofficial\nBandcamp: http://urfaust.bandcamp.com\nMetal Archives: http://www.metal-archives.com/bands/Urfaust/19596\n\n- Ván Records -\nWebsite: http://www.van-records.de\nFacebook: https://www.facebook.com/vanrecs\nBandcamp: http://vanrecords.bandcamp.com\nYouTube: https://www.youtube.com/vanrecords\nSoundcloud: https://soundcloud.com/v-n-records\n\nTracklist: \n1. Doctrine Of Spirit Obsession 00:00\n2. Behind The Veil Of The Trance Sleep 13:18\n3. A Course In Cosmic Meditation 21:06\n4. False Sensorial Impressions 25:40\n5. Trail Of The Conscience Of The Dead 31:42\n6. Eradication Through Hypnotic Suggestion 44:27\n\nThis video is for promotional use only!",
    "thumbnails": {
      "default": {
        "url": "https://i.ytimg.com/vi/ayCHct5hXPc/default.jpg",
        "width": 120,
        "height": 90
      },
      "medium": {
        "url": "https://i.ytimg.com/vi/ayCHct5hXPc/mqdefault.jpg",
        "width": 320,
        "height": 180
      },
      "high": {
        "url": "https://i.ytimg.com/vi/ayCHct5hXPc/hqdefault.jpg",
        "width": 480,
        "height": 360
      },
      "standard": {
        "url": "https://i.ytimg.com/vi/ayCHct5hXPc/sddefault.jpg",
        "width": 640,
        "height": 480
      },
      "maxres": {
        "url": "https://i.ytimg.com/vi/ayCHct5hXPc/maxresdefault.jpg",
        "width": 1280,
        "height": 720
      }
    },
    "channelTitle": "François Georgy",
    "playlistId": "PL_x8MpUypxebPe_XYyjJMJ5YWe972iOTr",
    "position": 1,
    "resourceId": {
      "kind": "youtube#video",
      "videoId": "ayCHct5hXPc"
    }
  },
  "contentDetails": {
    "videoId": "ayCHct5hXPc",
    "videoPublishedAt": "2018-05-04T10:59:02.000Z"
  }
}
    */
}

export default Videos;