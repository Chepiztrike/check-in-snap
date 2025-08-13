import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Wrench } from "lucide-react";
import MediaUploader, { MediaItem } from "@/components/checkin/MediaUploader";

interface PartEntry {
  id: string;
  serialNumber: string;
  partName: string;
  media: MediaItem[];
  justification: string;
}

interface PartsItemUploaderProps {
  part: PartEntry;
  onUpdate: (field: keyof PartEntry, value: any) => void;
  onRemove: () => void;
}

const PartsItemUploader = ({ part, onUpdate, onRemove }: PartsItemUploaderProps) => {
  const hasMedia = part.media && part.media.length > 0;

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" />
            <span className="font-medium">Service Part</span>
            {hasMedia && (
              <Badge variant="secondary">
                {part.media.length} file{part.media.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`serial-${part.id}`}>Serial Number</Label>
            <Input
              id={`serial-${part.id}`}
              value={part.serialNumber}
              onChange={(e) => onUpdate('serialNumber', e.target.value)}
              placeholder="Enter part serial number"
            />
          </div>
          <div>
            <Label htmlFor={`name-${part.id}`}>Part Name</Label>
            <Input
              id={`name-${part.id}`}
              value={part.partName}
              onChange={(e) => onUpdate('partName', e.target.value)}
              placeholder="Enter part name/description"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor={`justification-${part.id}`}>Justification for Use</Label>
          <Textarea
            id={`justification-${part.id}`}
            value={part.justification}
            onChange={(e) => onUpdate('justification', e.target.value)}
            placeholder="Explain why this part was used, what issue it addresses, etc."
            rows={3}
          />
        </div>

        <div>
          <MediaUploader
            title="Upload proof of part installation"
            value={part.media}
            onChange={(media) => onUpdate('media', media)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PartsItemUploader;