import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageIcon, VideoIcon, X } from "lucide-react";

export type MediaItem = {
  url: string;
  file: File;
  type: "image" | "video";
};

interface MediaUploaderProps {
  title: string;
  accept?: "image" | "video" | "both";
  multiple?: boolean;
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  className?: string;
}

const MediaUploader = ({
  title,
  accept = "both",
  multiple = true,
  value,
  onChange,
  className,
}: MediaUploaderProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = (files: FileList, type: "image" | "video") => {
    const items: MediaItem[] = Array.from(files).map((file) => ({
      file,
      type,
      url: URL.createObjectURL(file),
    }));
    onChange([...(value || []), ...items]);
  };

  const removeItem = (idx: number) => {
    const copy = [...value];
    const [removed] = copy.splice(idx, 1);
    try {
      URL.revokeObjectURL(removed.url);
    } catch {}
    onChange(copy);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-base font-medium">{title}</Label>
      <div className="flex flex-wrap gap-3">
        {(accept === "image" || accept === "both") && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading}
          >
            <ImageIcon /> Upload photo
          </Button>
        )}
        {(accept === "video" || accept === "both") && (
          <Button
            type="button"
            variant="outline"
            onClick={() => videoInputRef.current?.click()}
            disabled={uploading}
          >
            <VideoIcon /> Upload video
          </Button>
        )}
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        capture="environment"
        onChange={(e) => e.currentTarget.files && handleFiles(e.currentTarget.files, "image")}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple={multiple}
        className="hidden"
        capture
        onChange={(e) => e.currentTarget.files && handleFiles(e.currentTarget.files, "video")}
      />

      {value?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((m, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-md border bg-card">
              {m.type === "image" ? (
                <img
                  src={m.url}
                  alt={`Uploaded ${m.type}`}
                  loading="lazy"
                  className="h-32 w-full object-cover"
                />
              ) : (
                <video src={m.url} className="h-32 w-full object-cover" controls />
              )}
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full bg-background/80 p-1 shadow hover:opacity-90"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
