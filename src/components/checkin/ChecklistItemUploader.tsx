import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Check } from "lucide-react";
import MediaUploader, { MediaItem } from "./MediaUploader";

interface ChecklistItemUploaderProps {
  item: string;
  index: number;
  media: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
}

const ChecklistItemUploader = ({ item, index, media, onMediaChange }: ChecklistItemUploaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasMedia = media && media.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasMedia ? "secondary" : "outline"}
          className="w-full justify-start text-left h-auto p-3 relative"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="flex-shrink-0">
              {hasMedia ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Camera className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <span className="flex-1 text-sm">{item}</span>
            {hasMedia && (
              <Badge variant="secondary" className="ml-auto">
                {media.length}
              </Badge>
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-left">Upload Media for Checklist Item</DialogTitle>
          <p className="text-sm text-muted-foreground text-left">{item}</p>
        </DialogHeader>
        <div className="mt-4">
          <MediaUploader
            title="Add photos/videos for this item"
            value={media || []}
            onChange={onMediaChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChecklistItemUploader;