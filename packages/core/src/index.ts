import './asset-types.js';
import {Clipper} from './Clipper.js';
import type {TRenderAsset} from './CompositionManager.js';
import type {StaticFile} from './get-static-files.js';
import {useIsPlayer} from './is-player.js';
import {checkMultipleRemotionVersions} from './multiple-versions-warning.js';
import type {ClipRegion} from './NativeLayers.js';
import {Null} from './Null.js';
import type {VideoConfig} from './video-config.js';

export type VideoConfigWithSerializedProps = Omit<
	VideoConfig,
	'defaultProps' | 'props'
> & {
	serializedDefaultPropsWithCustomSchema: string;
	serializedResolvedPropsWithCustomSchema: string;
};

declare global {
	interface Window {
		remotion_renderReady: boolean;
		remotion_delayRenderTimeouts: {
			[key: string]: {label: string | null; timeout: number | NodeJS.Timeout};
		};
		remotion_cancelledError: string | undefined;
		remotion_getCompositionNames: () => string[];
		getStaticCompositions: () => Promise<VideoConfigWithSerializedProps[]>;
		remotion_calculateComposition: (
			compId: string,
		) => Promise<VideoConfigWithSerializedProps>;
		remotion_setBundleMode: (bundleMode: BundleState) => void;
		remotion_staticBase: string;
		remotion_staticFiles: StaticFile[];
		remotion_publicFolderExists: string | null;
		remotion_editorName: string | null;
		remotion_numberOfAudioTags: number;
		remotion_projectName: string;
		remotion_cwd: string;
		remotion_studioServerCommand: string;
		remotion_setFrame: (frame: number, composition: string) => void;
		remotion_initialFrame: number;
		remotion_proxyPort: number;
		remotion_audioEnabled: boolean;
		remotion_videoEnabled: boolean;
		remotion_puppeteerTimeout: number;
		remotion_inputProps: string;
		remotion_envVariables: string;
		remotion_collectAssets: () => TRenderAsset[];
		remotion_getClipRegion: () => ClipRegion | null;
		remotion_isPlayer: boolean;
		remotion_isBuilding: undefined | (() => void);
		remotion_finishedBuilding: undefined | (() => void);
		siteVersion: '10';
		remotion_version: string;
		remotion_imported: string | boolean;
		remotion_unsavedProps: boolean | undefined;
	}
}

export type BundleState =
	| {
			type: 'index';
	  }
	| {
			type: 'evaluation';
	  }
	| {
			type: 'composition';
			compositionName: string;
			serializedResolvedPropsWithSchema: string;
			compositionHeight: number;
			compositionDurationInFrames: number;
			compositionWidth: number;
			compositionFps: number;
	  };

checkMultipleRemotionVersions();
export * from './AbsoluteFill.js';
export * from './audio/index.js';
export {cancelRender} from './cancel-render.js';
export {
	CalculateMetadataFunction,
	Composition,
	CompositionProps,
	CompProps,
	StillProps,
} from './Composition.js';
export {
	AnyCompMetadata,
	AnyComposition,
	SmallTCompMetadata,
	TCompMetadata,
	TRenderAsset,
} from './CompositionManager.js';
export type {CanvasContent} from './CompositionManagerContext.js';
export {getInputProps} from './config/input-props.js';
export {continueRender, delayRender} from './delay-render.js';
export * from './easing.js';
export * from './Folder.js';
export * from './freeze.js';
export {getRemotionEnvironment} from './get-remotion-environment.js';
export {getStaticFiles, StaticFile} from './get-static-files.js';
export * from './IFrame.js';
export {Img, ImgProps} from './Img.js';
export * from './internals.js';
export {interpolateColors} from './interpolate-colors.js';
export {
	EasingFunction,
	ExtrapolateType,
	interpolate,
	InterpolateOptions,
} from './interpolate.js';
export {Loop} from './loop/index.js';
export {ClipRegion} from './NativeLayers.js';
export {prefetch} from './prefetch.js';
export {random, RandomSeed} from './random.js';
export {registerRoot} from './register-root.js';
export {Sequence} from './Sequence.js';
export {Series} from './series/index.js';
export * from './spring/index.js';
export {staticFile} from './static-file.js';
export * from './Still.js';
export type {PlayableMediaTag} from './timeline-position-state.js';
export {useCurrentFrame} from './use-current-frame.js';
export * from './use-video-config.js';
export * from './version.js';
export * from './video-config.js';
export * from './video/index.js';

export const Experimental = {
	/**
	 * @description This is a special component that will cause Remotion to only partially capture the frame of the video.
	 * @see [Documentation](https://www.remotion.dev/docs/clipper)
	 */
	Clipper,
	/**
	 * @description This is a special component, that, when rendered, will skip rendering the frame altogether.
	 * @see [Documentation](https://www.remotion.dev/docs/null)
	 */
	Null,
	useIsPlayer,
};

const proxyObj = {};

export const Config = new Proxy(proxyObj, {
	get(_, prop): unknown {
		if (
			prop === 'Bundling' ||
			prop === 'Rendering' ||
			prop === 'Log' ||
			prop === 'Puppeteer' ||
			prop === 'Output'
		) {
			return Config;
		}

		return () => {
			console.warn(
				'⚠️  The CLI configuration has been extracted from Remotion Core.',
			);
			console.warn('Update the import from the config file:');
			console.warn();
			console.warn('- Delete:');
			console.warn('import {Config} from "remotion";');
			console.warn('+ Replace:');
			console.warn('import {Config} from "@remotion/cli/config";');
			console.warn();
			console.warn(
				'For more information, see https://www.remotion.dev/docs/4-0-migration.',
			);

			process.exit(1);
		};
	},
});
