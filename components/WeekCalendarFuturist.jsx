import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 10 créneaux horaires personnalisés (exemple)
const hours = [
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30'
];
const days = [
  'LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.', 'DIM.'
];
const getDateOfWeek = (weekStart, dayOffset) => {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + dayOffset);
  return d;
};

const EVENT_TYPE = 'AGENDA_EVENT';

function DraggableEvent({ eventKey, heure, event, onDelete }) {
  const [{ isDragging }, drag] = useDrag({
    type: EVENT_TYPE,
    item: { eventKey, event },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <span
      className="futurist-agenda-event"
      ref={drag}
      style={{
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      <span style={{ display: 'block', textAlign: 'center', fontWeight: 700, fontSize: '0.95em', marginBottom: 2 }}>{heure}</span>
      <span style={{ display: 'block', textAlign: 'left', fontWeight: 500 }}>{event.value}</span>
      {event.motif && (
        <span className="futurist-agenda-motif"> — {event.motif}</span>
      )}
      <button
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          background: 'transparent',
          border: 'none',
          color: '#ff3a3a',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '1em',
          padding: 0,
          lineHeight: 1
        }}
        title="Supprimer"
        onClick={onDelete}
      >×</button>
    </span>
  );
}
function DroppableCell({ dayIdx, hourIdx, onDropEvent, children, ...props }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: EVENT_TYPE,
    drop: (item) => {
      onDropEvent(item, dayIdx, hourIdx);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  return (
    <div
      ref={drop}
      style={{
        ...props.style,
        background: isOver && canDrop ? '#3ad4ff22' : undefined,
        transition: 'background 0.2s',
      }}
      {...props}
    >
      {children}
    </div>
  );
}


function WeekCalendarFuturist() {
  const LOCAL_STORAGE_KEY = 'week-calendar-events';
  // Semaine du 20 janvier 2035
  const weekStart = new Date(2035, 0, 15); // Lundi 15 janvier 2035
  const [events, setEvents] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {};
  });

  // Sauvegarder les événements à chaque modification
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }, [events]);
  const [modal, setModal] = useState({ open: false, day: null, hour: null, value: '', customTime: '', motif: '' });

  const handleCellClick = (dayIdx, hourIdx) => {
    // Cherche un event précis à ce créneau, sinon vide
    const eventKey = Object.keys(events).find(k => k.startsWith(`${dayIdx}-${hourIdx}`));
    const event = eventKey ? events[eventKey] : { value: '', motif: '' };
    setModal({ open: true, day: dayIdx, hour: hourIdx, value: event.value || '', customTime: '', motif: event.motif || '' });
  };
  const handleSave = () => {
    // Si customTime est rempli, on l'utilise, sinon l'heure de la case
    const hourLabel = modal.customTime.trim() ? modal.customTime.trim() : hours[modal.hour];
    setEvents({ ...events, [`${modal.day}-${modal.hour}-${hourLabel}`]: { value: modal.value, motif: modal.motif } });
    setModal({ ...modal, open: false });
  };

  // Déplacement d'un événement par drag & drop
  const handleDropEvent = (item, newDayIdx, newHourIdx) => {
    const oldKey = item.eventKey;
    const oldEvent = events[oldKey];
    if (!oldEvent) return;
    // Générer nouvelle clé
    const hourLabel = hours[newHourIdx];
    const newKey = `${newDayIdx}-${newHourIdx}-${hourLabel}`;
    // Empêcher d'écraser un event existant
    if (events[newKey]) return;
    const newEvents = { ...events };
    delete newEvents[oldKey];
    newEvents[newKey] = oldEvent;
    setEvents(newEvents);
  };

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="futurist-agenda-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '1100px', margin: '0 auto', overflowX: 'auto', padding: '2rem 1rem' }}>
      <div className="futurist-agenda-header">
        <span className="futurist-agenda-title">Agenda Hebdomadaire</span>
      </div>
      <div
        className="futurist-agenda-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${days.length}, 1fr)`,
          gridTemplateRows: `1fr repeat(${hours.length}, 1fr)`,
          width: '100%',
          minWidth: 0,
          margin: '0 auto',
        }}
      >
        {/* En-têtes jours */}
        {days.map((d, i) => (
          <div
            key={i}
            className="futurist-agenda-cell futurist-agenda-day"
            style={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '2px solid #3ad4ff99',
              height: '100%'
            }}
          >
            {d}
          </div>
        ))}
        {/* Cases */}
        {hours.map((h, hourIdx) =>
          days.map((_, dayIdx) => {
            const eventKeys = Object.keys(events).filter(k => k.startsWith(`${dayIdx}-${hourIdx}`));
            const isFirstRow = hourIdx === 0;
            return (
              <DroppableCell
                key={dayIdx + '-' + hourIdx}
                dayIdx={dayIdx}
                hourIdx={hourIdx}
                onDropEvent={handleDropEvent}
                className={
                  'futurist-agenda-cell futurist-agenda-slot' +
                  (eventKeys.length > 0 ? ' futurist-agenda-has-event' : '')
                }
                style={{
                  minHeight: 60,
                  minWidth: 100,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  boxSizing: 'border-box',
                  borderTop: isFirstRow ? 'none' : undefined,
                  borderBottom: '1px solid #3ad4ff55'
                }}
                onClick={() => handleCellClick(dayIdx, hourIdx)}
              >
                {eventKeys.map(key => {
                  const heure = key.split('-')[2] || '';
                  return (
                    <DraggableEvent
                      key={key}
                      eventKey={key}
                      heure={heure}
                      event={events[key]}
                      onDelete={e => {
                        e.stopPropagation();
                        const newEvents = { ...events };
                        delete newEvents[key];
                        setEvents(newEvents);
                      }}
                    />
                  );
                })}
              </DroppableCell>
            );
          })
        )}
      </div>
      {modal.open && (
        <div className="futurist-agenda-modal-bg" onClick={() => setModal({ ...modal, open: false })}>
          <div className="futurist-agenda-modal" onClick={e => e.stopPropagation()} style={{maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch', padding: '2rem 1.5rem'}}>
            <div className="futurist-agenda-modal-title" style={{textAlign: 'center', marginBottom: 8}}>
              {days[modal.day]}, {hours[modal.hour]}
            </div>
            <input
              className="futurist-agenda-modal-input"
              type="text"
              value={modal.customTime}
              onChange={e => setModal({ ...modal, customTime: e.target.value })}
              placeholder="Heure précise (ex: 21:45)"
              style={{ marginBottom: 8 }}
            />
            <textarea
              className="futurist-agenda-modal-input"
              value={modal.value}
              onChange={e => setModal({ ...modal, value: e.target.value })}
              placeholder="Ajouter un rendez-vous..."
              autoFocus
              style={{ minHeight: 60, marginBottom: 8 }}
            />
            <input
              className="futurist-agenda-modal-input"
              type="text"
              value={modal.motif}
              onChange={e => setModal({ ...modal, motif: e.target.value })}
              placeholder="Motif (optionnel, visible dans l'aperçu)"
              style={{ marginBottom: 8 }}
            />
            <button className="futurist-agenda-modal-btn" onClick={handleSave}>
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
    </DndProvider>
  );
}

export default WeekCalendarFuturist;
