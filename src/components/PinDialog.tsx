import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remark: string;
  onRemarkChange: (value: string) => void;
  onSave: () => void;
  address: string;
}

export function PinDialog({
  open,
  onOpenChange,
  remark,
  onRemarkChange,
  onSave,
  address,
}: PinDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] z-[1000] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
        <DialogHeader>
          <DialogTitle>Add New Pin</DialogTitle>
          <DialogDescription>Add a remark for this location.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid items-center grid-cols-4 gap-4'>
            <Label htmlFor='remark' className='text-right'>
              Remark
            </Label>
            <Input
              id='remark'
              value={remark}
              onChange={(e) => onRemarkChange(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid items-center grid-cols-4 gap-4'>
            <Label className='text-right'>Address</Label>
            <div className='col-span-3 text-sm text-gray-500'>{address}</div>
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={onSave}>
            Save pin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
