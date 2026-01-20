import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import WeekCalendarFuturist from './WeekCalendarFuturist';


export default function CalendarButton() {
  const [open, setOpen] = useState(false);


  return (
    <>
      <button
        className="ml-2 p-2 rounded-full hover:bg-cyan-800/40 transition-colors border border-cyan-700/30"
        title="Voir le calendrier des rendez-vous"
        onClick={() => setOpen(true)}
      >
        <CalendarIcon className="w-6 h-6 text-cyan-300" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl p-0 bg-transparent shadow-none border-none">
          <WeekCalendarFuturist />
        </DialogContent>
      </Dialog>
    </>
  );
}
