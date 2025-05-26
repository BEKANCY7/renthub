"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PropertyViewerProps {
  kuulaUrl?: string;
  modelUrl?: string;
  title: string;
  address?: string;
}

export default function PropertyViewer({
  kuulaUrl,
  modelUrl,
  title,
  address,
}: PropertyViewerProps) {
  const [activeTab, setActiveTab] = useState<string>("3d-tour");
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);

  // Check if we're in a browser environment before using window
  const isBrowser = typeof window !== "undefined";

  // Default URLs if none provided
  const defaultKuulaUrl = "https://kuula.co/share/collection/7X7Pc";
  const defaultModelUrl =
    "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

  // Use provided URLs or fallbacks
  const tourUrl = kuulaUrl || defaultKuulaUrl;
  const model3dUrl = modelUrl || defaultModelUrl;

  useEffect(() => {
    // Only run in browser environment
    if (!isBrowser) return;

    // Check if model-viewer is already defined
    if (customElements.get("model-viewer")) {
      setModelViewerLoaded(true);
      return;
    }

    // Load model-viewer script
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js";
    script.onload = () => setModelViewerLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [isBrowser]);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        {address && <p className="text-sm text-muted-foreground">{address}</p>}
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="3d-tour">Virtual Tour</TabsTrigger>
            <TabsTrigger value="3d-model">3D Model</TabsTrigger>
          </TabsList>
        </div>
        <CardContent className="p-0 pt-3">
          <TabsContent value="3d-tour" className="mt-0">
            <div className="relative w-full h-[400px]">
              <iframe
                src={tourUrl}
                className="w-full h-full border-0"
                allowFullScreen
                allow="xr-spatial-tracking"
                title="Virtual Tour"
              ></iframe>
            </div>
          </TabsContent>
          <TabsContent value="3d-model" className="mt-0">
            <div className="relative w-full h-[400px] bg-gray-100">
              {modelViewerLoaded ? (
                // @ts-ignore - model-viewer is a custom element
                <model-viewer
                  src={model3dUrl}
                  alt="3D model of the property"
                  auto-rotate
                  camera-controls
                  shadow-intensity="1"
                  style={{ width: "100%", height: "100%" }}
                ></model-viewer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>Loading 3D viewer...</p>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      <div className="p-6 pt-2">
        <Button variant="outline" size="sm" className="w-full">
          Schedule a Virtual Tour
        </Button>
      </div>
    </Card>
  );
}
