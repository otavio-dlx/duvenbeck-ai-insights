import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIdeasFor, listDataKeys } from "@/lib/data";
import React, { useEffect, useState } from "react";

export const DataViewer: React.FC = () => {
  const [keys, setKeys] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    (async () => {
      const k = await listDataKeys();
      setKeys(k);
      if (k.length > 0) setSelected(k[0]);
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    (async () => {
      const data = await getIdeasFor(selected);
      setIdeas(data);
    })();
  }, [selected]);

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle>Datasets</CardTitle>
      </CardHeader>
      <CardContent className="overflow-visible">
        <div className="mb-4 flex flex-wrap gap-2 relative z-10">
          {keys.map((k) => (
            <button
              key={k}
              className={`px-3 py-1 rounded-md border hover:bg-muted/50 transition-colors shadow-sm ${
                k === selected ? "bg-muted" : "bg-background"
              }`}
              onClick={() => setSelected(k)}
            >
              {k}
            </button>
          ))}
        </div>

        {selected && (
          <div>
            <h3 className="font-semibold mb-2">{selected}</h3>
            <pre className="whitespace-pre-wrap text-xs max-h-96 overflow-auto">
              {ideas ? JSON.stringify(ideas, null, 2) : "Loading..."}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
