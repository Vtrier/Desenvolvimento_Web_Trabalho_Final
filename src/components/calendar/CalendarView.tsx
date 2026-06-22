"use client";

import { useMemo, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventContentArg } from "@fullcalendar/core";
import { Task } from "@/types/task";

interface Props {
  tasks: Task[];
  onEventClick: (task: Task) => void;
}

const priorityColor: Record<string, string> = {
  baixa: "#10b981",
  media: "#eab308",
  alta:  "#ef4444",
};

export default function CalendarView({ tasks, onEventClick }: Props) {
  const calendarRef = useRef<FullCalendar>(null);

  const events = useMemo(
    () =>
      tasks.map((task) => ({
        id: task.id,
        title: task.title,
        date: task.dueDate,
        backgroundColor: "transparent",
        borderColor: "transparent",
        extendedProps: { task },
      })),
    [tasks]
  );

  function handleEventClick(arg: EventClickArg) {
    const task = arg.event.extendedProps.task as Task;
    onEventClick(task);
  }

  function renderEventContent(arg: EventContentArg) {
    const task = arg.event.extendedProps.task as Task;
    const color = priorityColor[task.priority] ?? "#6366f1";
    const isDone = task.status === "concluida";

    return (
      <div
        className={`
          flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium
          cursor-pointer transition-all hover:brightness-110 truncate w-full
          ${isDone ? "opacity-50" : ""}
        `}
        style={{
          backgroundColor: `${color}22`,
          color,
          border: `1px solid ${color}40`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className={`truncate ${isDone ? "line-through" : ""}`}>
          {arg.event.title}
        </span>
      </div>
    );
  }

  return (
    <div className="taskflow-calendar">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="pt-br"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        buttonText={{
          today: "Hoje",
          month: "Mês",
          week: "Semana",
        }}
        events={events}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        height="auto"
        dayMaxEvents={3}
        moreLinkText={(n) => `+${n} mais`}
        firstDay={0}
      />
    </div>
  );
}
