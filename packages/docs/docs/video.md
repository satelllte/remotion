---
image: /generated/articles-docs-video.png
title: <Video>
id: video
crumb: "API"
---

This component allows you to include a video file in your Remotion project. It wraps the native [`HTMLVideoElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement).

## API

[Put a video file into the `public/` folder](/docs/assets) and use [`staticFile()`](/docs/staticfile) to reference it.

All the props that the native `<video>` element accepts (except `autoplay` and `controls`) will be forwarded (but of course not all are useful for Remotion). This means you can use all CSS to style the video.

```tsx twoslash
import { AbsoluteFill, staticFile, Video } from "remotion";

export const MyComposition = () => {
  return (
    <AbsoluteFill>
      <Video src={staticFile("video.webm")} />
    </AbsoluteFill>
  );
};
```

You can load a video from an URL as well:

```tsx twoslash
import { AbsoluteFill, Video } from "remotion";
// ---cut---
export const MyComposition = () => {
  return (
    <AbsoluteFill>
      <Video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
    </AbsoluteFill>
  );
};
```

### `startFrom` / `endAt`

`<Video>` has two more helper props you can use:

- `startFrom` will remove a portion of the video at the beginning
- `endAt` will remove a portion of the video at the end

In the following example, we assume that the [`fps`](/docs/composition#fps) of the composition is `30`.

By passing `startFrom={60}`, the playback starts immediately, but with the first 2 seconds of the video trimmed away.  
By passing `endAt={120}`, any video after the 4 second mark in the file will be trimmed away.

The video will play the range from `00:02:00` to `00:04:00`, meaning the video will play for 2 seconds.

```tsx twoslash
import { AbsoluteFill, staticFile, Video } from "remotion";

// ---cut---
export const MyComposition = () => {
  return (
    <AbsoluteFill>
      <Video src={staticFile("video.webm")} startFrom={60} endAt={120} />
    </AbsoluteFill>
  );
};
```

### `style`

You can pass any style you can pass to a native `<video>` element. This is how you set it's size for example:

```tsx twoslash
import { AbsoluteFill, staticFile, Video } from "remotion";

// ---cut---
export const MyComposition = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("video.webm")}
        style={{ height: 720, width: 1280 }}
      />
    </AbsoluteFill>
  );
};
```

### `volume`

`<Video>` accepts a `volume` prop which allows you to control the volume for the whole track or change it on a per-frame basis. Refer to the [using audio](/docs/using-audio#controlling-volume) guide to learn how to use it.

```tsx twoslash title="Example using static volume"
import { AbsoluteFill, staticFile, Video } from "remotion";

// ---cut---
export const MyComposition = () => {
  return (
    <AbsoluteFill>
      <Video volume={0.5} src={staticFile("video.webm")} />
    </AbsoluteFill>
  );
};
```

```tsx twoslash title="Example of a fade in over 100 frames"
import { AbsoluteFill, interpolate, staticFile, Video } from "remotion";

// ---cut---
export const MyComposition = () => {
  return (
    <AbsoluteFill>
      <Video
        volume={(f) =>
          interpolate(f, [0, 100], [0, 1], { extrapolateLeft: "clamp" })
        }
        src={staticFile("video.webm")}
      />
    </AbsoluteFill>
  );
};
```

### `playbackRate`<AvailableFrom v="2.2.0" />

You can use the `playbackRate` prop to control the speed of the video. `1` is the default and means regular speed, `0.5` slows down the video so it's twice as long and `2` speeds up the video so it's twice as fast.

While Remotion doesn't limit the range of possible playback speeds, in development mode the [`HTMLMediaElement.playbackRate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate) API is used which throws errors on extreme values. At the time of writing, Google Chrome throws an exception if the playback rate is below `0.0625` or above `16`.

```tsx twoslash title="Example of a video playing twice as fast"
import { AbsoluteFill, staticFile, Video } from "remotion";

// ---cut---
export const MyComposition = () => {
  return (
    <AbsoluteFill>
      <Video playbackRate={2} src={staticFile("video.webm")} />
    </AbsoluteFill>
  );
};
```

### `muted`

You can drop the audio of the video by adding a `muted` prop:

```tsx twoslash title="Example of a muted video"
import { AbsoluteFill, Video } from "remotion";
// ---cut---
export const MyComposition = () => {
  return (
    <AbsoluteFill>
      <Video
        muted
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      />
    </AbsoluteFill>
  );
};
```

### `loop`<AvailableFrom v="3.2.29" />

You can use the `loop` prop to loop a video.

```tsx twoslash title="Example of a looped video"
import { AbsoluteFill, Video } from "remotion";
// ---cut---
export const MyComposition = () => {
  return (
    <AbsoluteFill>
      <Video
        loop
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      />
    </AbsoluteFill>
  );
};
```

### `acceptableTimeShiftInSeconds`<AvailableFrom v="3.2.42" />

In the [Studio](/docs/terminology#remotion-studio) or in the [Remotion Player](/docs/player), Remotion will seek the video if it gets too much out of sync with Remotion's internal time - be it due to the video loading or the page being too slow to keep up in real-time. By default, a seek is triggered if `0.45` seconds of time shift is encountered. Using this prop, you can customize the threshold.

### `allowAmplificationDuringRender`<AvailableFrom v="3.3.17" />

Make values for [`volume`](#volume) greater than `1` result in amplification during renders.  
During Preview, the volume will be limited to `1`, since the browser cannot amplify audio.

### `toneFrequency`<AvailableFrom v="4.0.47"/>

Allows you to adjust the pitch of the audio - will only be applied during rendering. It accepts a number between `0.01` and `2`, where `1` represents the original pitch. Values less than `1` will decrease the pitch, while values greater than `1` will increase it.
For example, a `toneFrequency` of 0.5 would lower the pitch by half, and a `toneFrequency` of `1.5` would increase the pitch by 50%.
`toneFrequency` should be a positive number between `0.01` (representing the lowest assignable pitch) and `2` (representing the highest assignable pitch). If `toneFrequency` is not specified or null, it defaults to `1`, maintaining the original pitch.

### `onError`

Handle an error playing the video. From v3.3.89, if you pass an `onError` callback, then no exception will be thrown. Previously, the error could not be caught.

## Speed up renders for video with silent audio

Remotion will download the whole video during render in order to mix its audio. If the video contains a silent audio track, you can add the muted property to signal to Remotion that it does not need to download the video and make the render more efficient.

## Codec support

See: [Which video formats does Remotion support?](/docs/miscellaneous/video-formats)

## Alternative: `<OffthreadVideo>`

[`<OffthreadVideo>`](/docs/offthreadvideo) is a drop-in alternative to `<Video>`. To decide which tag to use, see: [`<Video>` vs `<OffthreadVideo>`](/docs/video-vs-offthreadvideo)

## See also

- [Source code for this function](https://github.com/remotion-dev/remotion/blob/main/packages/core/src/video/Video.tsx)
- [`<Audio />`](/docs/audio)
- [`<OffthreadVideo />`](/docs/offthreadvideo)
- [`<Video>` vs `<OffthreadVideo>`](/docs/video-vs-offthreadvideo)
- [`Change the speed of a video over time`](/docs/miscellaneous/snippets/accelerated-video)
