import React, { useState, useCallback, useRef, memo } from "react";
import { type IRenderOptions, useEmbedBlot } from "./hooks/use-react-blot";
import "./quill-next-image.css";

const Shimmer = memo(() => {
  return (
    <div className="qn-image-shimmer" />
  );
});

export function QuillNextImage(options: IRenderOptions) {
  const { naturalWidth = 800, naturalHeight = 20 } = options.attributes;
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageWidth, setImageWidth] = useState(naturalWidth);
  const [imageHeight, setImageHeight] = useState(naturalHeight);
  const [isLoading, setIsLoading] = useState(true);
  const onLoad = useCallback(() => {
    setIsLoading(false)

    setImageWidth(imageRef.current?.naturalWidth || naturalWidth);
    setImageHeight(imageRef.current?.naturalHeight || naturalHeight);
  }, []);

  const aspectRatio = (imageWidth as number) / (imageHeight as number);

  return (
    <div
      className="qn-image-container"
      style={{
        width: imageWidth + 'px',
        aspectRatio: aspectRatio,
      }}
    >
      {isLoading ? (
        <Shimmer />
      ) : <></>}
      <img
        ref={imageRef}
        src={options.value as string}
        onLoad={onLoad}
      />
    </div>
  );
}

export function useQuillNextImage() {
  return useEmbedBlot({
    blotName: "image",
    render: (options: IRenderOptions) => {
      return <QuillNextImage {...options} />;
    },
  });
}
