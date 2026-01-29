import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Link } from "../types/link";
import { currentLinks, fetchLinks, updateLink, deleteLink } from "../stores/lists";
import AddLink from "./AddLink";
import LinkItem from "./LinkItem";

interface ListContainerProps {
  listId: number;
  initialLinks?: Link[];
  isOwner?: boolean;
}

function SortableLinkItem({
  link,
  onUpdate,
  onDelete,
  isOwner,
}: {
  link: Link;
  onUpdate: (id: number, data: Partial<Link>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isOwner: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id, disabled: !isOwner });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 items-start">
      {isOwner && (
        <button
          {...attributes}
          {...listeners}
          className="mt-4 p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </button>
      )}
      <div className="flex-1">
        <LinkItem link={link} onUpdate={onUpdate} onDelete={onDelete} isOwner={isOwner} />
      </div>
    </div>
  );
}

export default function ListContainer({ listId, initialLinks = [], isOwner = true }: ListContainerProps) {
  const links = useStore(currentLinks);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (initialLinks.length > 0) {
      currentLinks.set(initialLinks);
      setIsLoading(false);
    } else {
      fetchLinks(listId).then(() => setIsLoading(false));
    }
  }, [listId, initialLinks]);

  const handleLinkAdded = () => {
    fetchLinks(listId);
  };

  const handleUpdate = async (linkId: number, data: Partial<Link>) => {
    await updateLink(linkId, listId, data);
  };

  const handleDelete = async (linkId: number) => {
    await deleteLink(linkId, listId);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!isOwner) return;
    
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);

      const newLinks = arrayMove(links, oldIndex, newIndex);
      currentLinks.set(newLinks);

      // Update positions in database
      await Promise.all(
        newLinks.map((link, index) =>
          fetch("/api/links", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: link.id, position: index }),
          })
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-[#15BFAE] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isOwner && <AddLink listId={listId} onLinkAdded={handleLinkAdded} />}

      {links.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-4 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <p>{isOwner ? "No links yet. Add your first link above!" : "No links in this list yet."}</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {links.map((link) => (
                <SortableLinkItem
                  key={link.id}
                  link={link}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  isOwner={isOwner}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
