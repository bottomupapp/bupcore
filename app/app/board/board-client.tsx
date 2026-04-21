"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Plus, Calendar, Flag } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type Task = {
  id: string;
  key: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  epic?: { id: string; key: string; title: string; color: string } | null;
  assignee?: { name?: string | null; email?: string | null; image?: string | null } | null;
};

type Sprint = { id: string; name: string; active: boolean };
type Epic = { id: string; key: string; title: string; color: string };

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "BACKLOG", label: "Backlog" },
  { id: "TODO", label: "To do" },
  { id: "IN_PROGRESS", label: "Devam" },
  { id: "REVIEW", label: "Review" },
  { id: "DONE", label: "Tamam" },
];

const PRIO_COLOR: Record<Priority, string> = {
  LOW: "text-sky-600",
  MEDIUM: "text-muted",
  HIGH: "text-orange-600",
  URGENT: "text-red-600",
};

export default function SprintBoardClient({
  sprints,
  epics,
  activeSprint,
  initialTasks,
}: {
  sprints: Sprint[];
  epics: Epic[];
  activeSprint: Sprint | null;
  initialTasks: Task[];
}) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [active, setActive] = useState<Task | null>(null);
  const [creatingIn, setCreatingIn] = useState<TaskStatus | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newEpic, setNewEpic] = useState<string>("");
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const grouped = useMemo(() => {
    const g: Record<TaskStatus, Task[]> = {
      BACKLOG: [],
      TODO: [],
      IN_PROGRESS: [],
      REVIEW: [],
      DONE: [],
    };
    tasks.forEach((t) => g[t.status].push(t));
    return g;
  }, [tasks]);

  function onDragStart(e: DragStartEvent) {
    const t = tasks.find((x) => x.id === e.active.id);
    if (t) setActive(t);
  }

  async function onDragEnd(e: DragEndEvent) {
    setActive(null);
    const overId = e.over?.id as string | undefined;
    const draggedId = e.active.id as string;
    if (!overId) return;
    const targetStatus = COLUMNS.find((c) => c.id === overId)?.id;
    if (!targetStatus) return;
    const dragged = tasks.find((t) => t.id === draggedId);
    if (!dragged || dragged.status === targetStatus) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggedId ? { ...t, status: targetStatus } : t,
      ),
    );

    await apiFetch(`/api/tasks/${draggedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: targetStatus }),
    });
  }

  async function createTask(status: TaskStatus) {
    if (!newTitle.trim() || !activeSprint) return;
    const res = await apiFetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        status,
        sprintId: activeSprint.id,
        epicId: newEpic || null,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      const epic = epics.find((e) => e.id === created.epicId) ?? null;
      setTasks((prev) => [...prev, { ...created, epic }]);
      setNewTitle("");
      setCreatingIn(null);
      setNewEpic("");
    }
  }

  async function changeSprint(sprintId: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("sprint", sprintId);
    window.location.href = url.toString();
  }

  async function createSprint() {
    const name = prompt("Sprint adı?");
    if (!name) return;
    const res = await apiFetch("/api/sprints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, active: true }),
    });
    if (res.ok) {
      const s = await res.json();
      const url = new URL(window.location.href);
      url.searchParams.set("sprint", s.id);
      window.location.href = url.toString();
    }
  }

  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Sprint Board</h1>
        <select
          value={activeSprint?.id ?? ""}
          onChange={(e) => changeSprint(e.target.value)}
          className="input w-52"
        >
          {sprints.length === 0 && <option>Sprint yok</option>}
          {sprints.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} {s.active ? "· aktif" : ""}
            </option>
          ))}
        </select>
        <button className="btn-outline" onClick={createSprint}>
          <Plus className="h-4 w-4" /> Yeni sprint
        </button>
        <div className="ml-auto text-sm text-muted">
          {tasks.length} task · {activeSprint?.name ?? "—"}
        </div>
      </div>

      {!activeSprint ? (
        <div className="card p-8 text-center text-muted">
          Aktif sprint yok. Yukarıdan yeni bir sprint oluştur.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                id={col.id}
                label={col.label}
                tasks={grouped[col.id]}
                onAdd={() => setCreatingIn(col.id)}
              >
                {creatingIn === col.id && (
                  <div className="card p-2 mb-2 space-y-2">
                    <input
                      autoFocus
                      className="input"
                      placeholder="Task başlığı..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") createTask(col.id);
                        if (e.key === "Escape") {
                          setNewTitle("");
                          setCreatingIn(null);
                        }
                      }}
                    />
                    <select
                      className="input"
                      value={newEpic}
                      onChange={(e) => setNewEpic(e.target.value)}
                    >
                      <option value="">Epic seç (opsiyonel)</option>
                      {epics.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.key} · {e.title}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-1 justify-end">
                      <button
                        className="btn-ghost"
                        onClick={() => {
                          setCreatingIn(null);
                          setNewTitle("");
                        }}
                      >
                        İptal
                      </button>
                      <button
                        className="btn-primary"
                        onClick={() => createTask(col.id)}
                      >
                        Ekle
                      </button>
                    </div>
                  </div>
                )}
              </Column>
            ))}
          </div>
          <DragOverlay>
            {active ? <TaskCard task={active} dragging /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

function Column({
  id,
  label,
  tasks,
  onAdd,
  children,
}: {
  id: TaskStatus;
  label: string;
  tasks: Task[];
  onAdd: () => void;
  children?: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-xl bg-border/20 p-2 min-h-0",
        isOver && "dnd-over",
      )}
    >
      <div className="flex items-center justify-between px-2 py-1 mb-1">
        <div className="text-sm font-semibold">
          {label}{" "}
          <span className="text-muted font-normal ml-1">{tasks.length}</span>
        </div>
        <button className="btn-ghost !p-1" onClick={onAdd}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {children}
        {tasks.map((t) => (
          <DraggableTask key={t.id} task={t} />
        ))}
      </div>
    </div>
  );
}

function DraggableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn("cursor-grab active:cursor-grabbing", isDragging && "dnd-dragging")}
    >
      <TaskCard task={task} />
    </div>
  );
}

function TaskCard({ task, dragging }: { task: Task; dragging?: boolean }) {
  return (
    <div className={cn("card p-3 space-y-2", dragging && "shadow-lg")}>
      {task.epic && (
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: task.epic.color }}
          />
          <span className="text-muted">
            {task.epic.key} · {task.epic.title}
          </span>
        </div>
      )}
      <div className="text-sm font-medium leading-snug">{task.title}</div>
      <div className="flex items-center gap-2 text-xs">
        <span className="chip !py-0">{task.key}</span>
        <Flag className={cn("h-3 w-3", PRIO_COLOR[task.priority])} />
        {task.assignee?.name && (
          <span className="ml-auto chip">{task.assignee.name.split(" ")[0]}</span>
        )}
      </div>
    </div>
  );
}
