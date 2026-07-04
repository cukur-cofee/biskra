import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// f_auto,q_auto:low,w_1280 → Cloudinary يختار أفضل صيغة بجودة منخفضة وعرض 1280px
const loaderVideo = "https://res.cloudinary.com/sfdktww4/video/upload/f_auto,q_auto:low,w_1280/intro-video.mp4";
// أول فريم من الفيديو كصورة ظاهرة فوراً قبل التحميل
const loaderPoster = "https://res.cloudinary.com/sfdktww4/video/upload/so_0,f_jpg,q_auto:low,w_1280/intro-video.jpg";

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

    // إذا تأخر التحميل أكثر من 4 ثواني نعدي مباشرة
    const timeout = setTimeout(onFinished, 4000);

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
        poster={loaderPoster}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}
