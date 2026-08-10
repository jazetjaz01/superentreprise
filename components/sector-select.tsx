"use client";

import { useMemo, useState } from "react";
import {
  type SectorItem,
  getActivityPath,
  sectorUniverses,
} from "@/lib/annonces/sectors";

const selectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function levelLabel(depth: number) {
  if (depth === 1) return "Catégorie";
  if (depth === 2) return "Activité";
  return "Précision";
}

export function SectorSelect({
  defaultUniverse,
  defaultActivity,
}: {
  defaultUniverse?: string | null;
  defaultActivity?: string | null;
}) {
  const initialPath = useMemo(() => {
    if (!defaultUniverse) return [] as string[];
    const trail = getActivityPath(defaultUniverse, defaultActivity ?? "");
    return [defaultUniverse, ...trail.map((node) => node.value)];
  }, [defaultUniverse, defaultActivity]);

  const [path, setPath] = useState<string[]>(initialPath);

  const universe = sectorUniverses.find((item) => item.value === path[0]);

  const levels: SectorItem[][] = [];
  if (universe) {
    let currentNodes: SectorItem[] = universe.categories;
    let depth = 1;
    while (currentNodes.length > 0) {
      levels.push(currentNodes);
      const selectedNode = currentNodes.find(
        (node) => node.value === path[depth],
      );
      if (selectedNode?.children) {
        currentNodes = selectedNode.children;
        depth += 1;
      } else {
        break;
      }
    }
  }

  const activityValue = path.length > 1 ? path[path.length - 1] : "";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" htmlFor="sector-universe">
          Univers
        </label>
        <select
          id="sector-universe"
          className={selectClassName}
          value={path[0] ?? ""}
          onChange={(event) =>
            setPath(event.target.value ? [event.target.value] : [])
          }
          required
        >
          <option value="" disabled>
            Sélectionner...
          </option>
          {sectorUniverses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {levels.map((nodes, index) => {
        const depth = index + 1;

        return (
          <div key={depth} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              {levelLabel(depth)}
            </label>
            <select
              className={selectClassName}
              value={path[depth] ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                setPath((prev) => {
                  const next = prev.slice(0, depth);
                  if (value) next.push(value);
                  return next;
                });
              }}
              required
            >
              <option value="" disabled>
                Sélectionner...
              </option>
              {nodes.map((node) => (
                <option key={node.value} value={node.value}>
                  {node.label}
                </option>
              ))}
            </select>
          </div>
        );
      })}

      <input type="hidden" name="sector" value={path[0] ?? ""} />
      <input type="hidden" name="activity" value={activityValue} />
    </div>
  );
}
