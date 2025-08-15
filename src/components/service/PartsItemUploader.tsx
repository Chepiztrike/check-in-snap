import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Wrench, Camera } from "lucide-react";
import MediaUploader, { MediaItem } from "@/components/checkin/MediaUploader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef } from "react";

interface PartEntry {
  id: string;
  serialNumber: string;
  partName: string;
  media: MediaItem[];
  justification: string;
  serialPhoto?: MediaItem[];
}

interface PartsItemUploaderProps {
  part: PartEntry;
  onUpdate: (field: keyof PartEntry, value: any) => void;
  onRemove: () => void;
}

const PartsItemUploader = ({ part, onUpdate, onRemove }: PartsItemUploaderProps) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasMedia = part.media && part.media.length > 0;

  const handleSerialPhotoUpload = (files: FileList) => {
    const file = files[0];
    if (file) {
      const photoItem: MediaItem = {
        file,
        type: "image",
        url: URL.createObjectURL(file),
      };
      onUpdate('serialPhoto', [photoItem]);
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" />
            <span className="font-medium">{t('service.part')}</span>
            {hasMedia && (
              <Badge variant="secondary">
                {part.media.length} {part.media.length === 1 ? t('file') : t('files')}
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
          <div className="space-y-2">
            <Label htmlFor={`serial-${part.id}`}>{t('serial.number')}</Label>
            <div className="flex gap-2">
              <Input
                id={`serial-${part.id}`}
                value={part.serialNumber}
                onChange={(e) => onUpdate('serialNumber', e.target.value)}
                placeholder={t('enter.serial.number')}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0"
                title={t('capture.serial.barcode')}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.currentTarget.files && handleSerialPhotoUpload(e.currentTarget.files)}
            />
            {part.serialPhoto && part.serialPhoto.length > 0 && (
              <div className="mt-2">
                <img
                  src={part.serialPhoto[0].url}
                  alt="Serial number"
                  className="h-20 w-20 object-cover rounded border"
                />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor={`name-${part.id}`}>{t('part.name')}</Label>
            <Input
              id={`name-${part.id}`}
              value={part.partName}
              onChange={(e) => onUpdate('partName', e.target.value)}
              placeholder={t('enter.part.name')}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor={`justification-${part.id}`}>{t('justification.use')}</Label>
          <Textarea
            id={`justification-${part.id}`}
            value={part.justification}
            onChange={(e) => onUpdate('justification', e.target.value)}
            placeholder={t('explain.part.used')}
            rows={3}
          />
        </div>

        <div>
          <MediaUploader
            title={t('upload.proof.installation')}
            value={part.media}
            onChange={(media) => onUpdate('media', media)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PartsItemUploader;