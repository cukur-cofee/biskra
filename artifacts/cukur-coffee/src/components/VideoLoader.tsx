import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import loaderVideo from "@assets/video_202607040648_1783144094217.mp4";

interface VideoLoaderProps {
  onFinished: () => void;
}

export default function VideoLoader({ onFinished }: VideoLoaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnd = () => onFinished();
    video.addEventListener("ended", handleEnd);

    // fallback: إذا تأخر الفيديو أكثر من 8 ثواني
    const timeout = setTimeout(onFinished, 8000);

    return () => {
      video.removeEventListener("ended", handleEnd);
      clearTimeout(timeout);
    };
  }, [onFinished]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <video
        ref={videoRef}
        src={loaderVideo}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}
