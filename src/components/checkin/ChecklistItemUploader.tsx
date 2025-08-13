import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Check, Wrench, X } from "lucide-react";
import MediaUploader, { MediaItem } from "./MediaUploader";

interface ChecklistItemUploaderProps {
  item: string;
  index: number;
  media: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
  serviceNeeded: boolean;
  onServiceChange: (serviceNeeded: boolean) => void;
}

const ChecklistItemUploader = ({ item, index, media, onMediaChange, serviceNeeded, onServiceChange }: ChecklistItemUploaderProps) => {
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
            <div className="flex items-center gap-2 ml-auto">
              {serviceNeeded && (
                <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
                  <Wrench className="h-3 w-3 mr-1" />
                  Service
                </Badge>
              )}
              {hasMedia && (
                <Badge variant="secondary">
                  {media.length}
                </Badge>
              )}
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-left">Upload Media for Checklist Item</DialogTitle>
          <p className="text-sm text-muted-foreground text-left">{item}</p>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Service needed for this item:</span>
            <Button
              variant={serviceNeeded ? "default" : "outline"}
              size="sm"
              onClick={() => onServiceChange(!serviceNeeded)}
              className="h-8"
            >
              {serviceNeeded ? (
                <>
                  <Wrench className="h-3 w-3 mr-1" />
                  Service Required
                </>
              ) : (
                <>
                  <X className="h-3 w-3 mr-1" />
                  No Service
                </>
              )}
            </Button>
          </div>
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