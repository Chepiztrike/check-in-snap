import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Check, CheckCircle, X } from "lucide-react";
import MediaUploader, { MediaItem } from "@/components/checkin/MediaUploader";

interface CheckoutItemUploaderProps {
  item: string;
  index: number;
  media: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
  approved: boolean;
  onApprovalChange: (approved: boolean) => void;
}

const CheckoutItemUploader = ({ item, index, media, onMediaChange, approved, onApprovalChange }: CheckoutItemUploaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasMedia = media && media.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={approved ? "secondary" : "outline"}
          className="w-full justify-start text-left h-auto p-3 relative"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="flex-shrink-0">
              {approved ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : hasMedia ? (
                <Check className="h-4 w-4 text-blue-600" />
              ) : (
                <Camera className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <span className="flex-1 text-sm">{item}</span>
            <div className="flex items-center gap-2 ml-auto">
              {approved && (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
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
          <DialogTitle className="text-left">Customer Approval for Checklist Item</DialogTitle>
          <p className="text-sm text-muted-foreground text-left">{item}</p>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Customer approval status:</span>
            <Button
              variant={approved ? "default" : "outline"}
              size="sm"
              onClick={() => onApprovalChange(!approved)}
              className="h-8"
            >
              {approved ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved by Customer
                </>
              ) : (
                <>
                  <X className="h-3 w-3 mr-1" />
                  Pending Approval
                </>
              )}
            </Button>
          </div>
          <MediaUploader
            title="Add photos/videos for customer review"
            value={media || []}
            onChange={onMediaChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutItemUploader;